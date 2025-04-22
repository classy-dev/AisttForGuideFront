export const fromImageDataTo2DUnitArray = ({ width, height }: ImageData) =>
  new Uint8Array(width * height);

export function calculateNonZeroCentroid(
  data: Uint8Array,
  width: number,
  height: number
) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = data[y * width + x];
      if (value !== 0) {
        sumX += x;
        sumY += y;
        count++;
      }
    }
  }

  if (count === 0) {
    return { x: 0, y: 0 }; // 0이 아닌 값이 없는 경우
  }

  return {
    x: sumX / count,
    y: sumY / count,
  };
}

// 테스트 코드는 이전과 동일
export const getComputedDataFromHitmap = (
  baseImageData: ImageData,
  colorImageData: ImageData,
  hitmap: Uint8Array
): Uint8Array => {
  const { width, height, data: baseData } = baseImageData;
  const { data: colorData } = colorImageData ?? new ImageData(1, 1);

  const threshold = 0;
  const cacheCount = 12;
  const baseArray = new Uint8Array(width * height);

  const length = baseData.length;

  for (let i = 0; i < length; i += 4) {
    const index = i >> 2; // Equivalent to Math.floor(i / 4)
    if (baseData[i + 3] > threshold && colorData[i + 3] > threshold) {
      baseArray[index] = 1;
      hitmap[index] = 1;
    } else if (
      baseData[i + 3] > threshold &&
      hitmap[index] > 0 &&
      hitmap[index] <= cacheCount
    ) {
      baseArray[index] = 1;
      hitmap[index]++;
    } else if (baseData[i + 3] > threshold) {
      baseArray[index] = 2;
      hitmap[index] = 0;
    }
  }

  return baseArray;
};
