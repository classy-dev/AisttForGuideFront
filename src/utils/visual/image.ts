import { ToppingArea } from 'InterfaceFarm/menu';
import {
  applyDoughInnerClip,
  applyHalfLeftClip,
  applyHalfRightClip,
} from './clip';

type InputImage = HTMLImageElement | ImageBitmap | string;

export type DoughRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  imageData: ImageData;
  naturalWidth: number;
  naturalHeight: number;
};

const doughClips: Record<
  ToppingArea,
  | ((ctx: CanvasRenderingContext2D, width: number, height: number) => void)
  | null
> = {
  half_left: applyHalfLeftClip,
  half_right: applyHalfRightClip,
  dough_inner: applyDoughInnerClip,
};

const canvas = document.createElement('canvas') as HTMLCanvasElement;

// 이미지데이터 가져오기 함수
export const fetchImage = async (src: string) => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }

  const blob = await response.blob();

  return createImageBitmap(blob);
};

// 압축된 이미지데이터 생성함수
export const getCompressedImageData = (
  imageData: ImageData,
  scale: number = 0.5
) => {
  const compressSize = Math.max(1 / scale, 1);
  const compressWidth = Math.ceil(imageData.width / compressSize);
  const compressHeight = Math.ceil(imageData.height / compressSize);

  const newCompressed = new Uint8ClampedArray(
    compressWidth * compressHeight * 4
  );

  for (let y = 0; y < compressHeight; y++) {
    for (let x = 0; x < compressWidth; x++) {
      const index = y * compressWidth * 4 + x * 4;
      const rgba = imageData.data.slice(
        (y * compressSize * imageData.width + x * compressSize) * 4,
        (y * compressSize * imageData.width + x * compressSize) * 4 + 4
      );

      newCompressed.set(rgba, index);
    }
  }

  return new ImageData(newCompressed, compressWidth, compressHeight);
};

export const getCompressedImageDataWithRotate = (
  imageData: ImageData,
  scale: number = 0.5
) => {
  const compressSize = Math.max(1 / scale, 1);
  const compressWidth = Math.ceil(imageData.width / compressSize);
  const compressHeight = Math.ceil(imageData.height / compressSize);

  // TypedArray 직접 접근으로 성능 향상
  const srcData = new Uint32Array(imageData.data.buffer);
  const newCompressed = new Uint8ClampedArray(
    compressWidth * compressHeight * 4
  );
  const dstData = new Uint32Array(newCompressed.buffer);

  const widthStride = imageData.width;
  const scaleInt = Math.floor(compressSize);

  // 최적화된 루프
  let dstIdx = 0;
  for (let y = 0; y < compressHeight; y++) {
    const srcY = y * scaleInt;
    for (let x = 0; x < compressWidth; x++) {
      const srcX = x * scaleInt;
      const srcIdx = srcY * widthStride + srcX;
      dstData[dstIdx++] = srcData[srcIdx];
    }
  }

  return new ImageData(newCompressed, compressWidth, compressHeight);
};

export const calculateDoughRect = async (
  input: InputImage,
  doughType?: ToppingArea
) => {
  const image = typeof input === 'string' ? await fetchImage(input) : input;

  const size =
    image instanceof HTMLImageElement
      ? image.getBoundingClientRect()
      : { width: image.width, height: image.height };

  const downsampleFactor = 4; // 4로 고정

  canvas.width = Math.floor(size.width / downsampleFactor);
  canvas.height = Math.floor(size.height / downsampleFactor);

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
  });

  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 최적화된 경계 찾기
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data32 = new Uint32Array(imageData.data.buffer);
  const tlCorner = { x: canvas.width + 1, y: canvas.height + 1 };
  const brCorner = { x: -1, y: -1 };

  // 32비트 단위로 처리하여 성능 향상
  for (let y = 0; y < canvas.height; y++) {
    const rowOffset = y * canvas.width;
    let hasPixelInRow = false;

    // 각 행의 첫 번째와 마지막 불투명 픽셀 찾기
    for (let x = 0; x < canvas.width; x++) {
      const pixel32 = data32[rowOffset + x];
      if (pixel32 !== 0) {
        if (!hasPixelInRow) {
          tlCorner.x = Math.min(x, tlCorner.x);
          hasPixelInRow = true;
        }
        brCorner.x = Math.max(x, brCorner.x);
      }
    }

    // 이 행에 픽셀이 있다면 y 좌표 업데이트
    if (hasPixelInRow) {
      tlCorner.y = Math.min(y, tlCorner.y);
      brCorner.y = Math.max(y, brCorner.y);
    }
  }

  // 원본 크기로 변환
  const left = tlCorner.x * downsampleFactor;
  const top = tlCorner.y * downsampleFactor;
  const width = (brCorner.x - tlCorner.x + 1) * downsampleFactor;
  const height = (brCorner.y - tlCorner.y + 1) * downsampleFactor;

  const originWidth =
    image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const originHeight =
    image instanceof HTMLImageElement ? image.naturalHeight : image.height;

  const naturalWidth = width * (originWidth / size.width);
  const naturalHeight = height * (originHeight / size.height);
  const naturalLeft = left * (originWidth / size.width);
  const naturalTop = top * (originHeight / size.height);

  // 최종 이미지 생성
  canvas.width = width;
  canvas.height = height;

  if (doughType && doughClips[doughType]) {
    doughClips[doughType]?.(ctx, width, height);
  }

  ctx.drawImage(
    image,
    naturalLeft,
    naturalTop,
    naturalWidth,
    naturalHeight,
    0,
    0,
    width,
    height
  );

  const returnImageData = ctx.getImageData(0, 0, width, height);
  const compressedData = getCompressedImageData(returnImageData, 1 / 3);

  return {
    width,
    height,
    left,
    top,
    imageData: compressedData,
    naturalWidth,
    naturalHeight,
  } as DoughRect;
};
