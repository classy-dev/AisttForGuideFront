import { getCompressedImageData } from './image';
import { segmentPresetW } from './segmentPreset';

// 조각별 이미지데이터 분할함수
export const getFragmentImageData = async (
  image: ImageBitmap | ImageData,
  regions: number[][]
) => {
  const imageDataList = [];
  const bitmap = await (image instanceof ImageData
    ? createImageBitmap(image)
    : image);

  const offcanvas = new OffscreenCanvas(image.width, image.height);
  const offctx = offcanvas.getContext('2d', {
    willReadFrequently: true,
  });

  if (!offctx) return [];

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];

    // @ts-ignore
    offctx.reset();
    offctx.beginPath();
    offctx.moveTo(region[0], region[1]);
    offctx.lineTo(region[2], region[3]);
    offctx.lineTo(region[4], region[5]);
    offctx.lineTo(region[6], region[7]);
    offctx.lineTo(region[0], region[1]);
    offctx.closePath();

    offctx.clip();

    offctx.drawImage(bitmap, 0, 0);

    const minX = Math.min(region[0], region[2], region[4], region[6]);
    const maxX = Math.max(region[0], region[2], region[4], region[6]);
    const minY = Math.min(region[1], region[3], region[5], region[7]);
    const maxY = Math.max(region[1], region[3], region[5], region[7]);

    const imageData = offctx.getImageData(minX, minY, maxX - minX, maxY - minY);

    imageDataList.push(imageData);
  }

  return imageDataList;
};

export const segmentRegularPizzaImageData = async (
  imageData: Blob,
  colorImageData: Blob
) => {
  const [image, colorImage] = await Promise.all(
    [imageData, colorImageData].map(blob => createImageBitmap(blob))
  );

  const { width, height } = image;

  // W 조각에 대한 좌표
  const regions = segmentPresetW(width, height);

  // W조각으로 분할된 이미지 데이터 리스트 및 컬러 이미지 데이터 리스트
  const fragmentImageDataList = await getFragmentImageData(image, regions);
  const fragmentColorImageDataList = await getFragmentImageData(
    colorImage,
    regions
  );

  image.close();
  colorImage.close();

  const compressedImageDataList = fragmentImageDataList.map(imageData =>
    getCompressedImageData(imageData)
  );

  const compressedColorImageDataList = fragmentColorImageDataList.map(
    imageData => getCompressedImageData(imageData)
  );

  return {
    compressedImageDataList,
    compressedColorImageDataList,
    fragmentImageDataList,
    fragmentColorImageDataList,
  };
};
