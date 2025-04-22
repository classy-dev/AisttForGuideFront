export type BoundingBox = [x1: number, y1: number, x2: number, y2: number];
export type ScaleFactor = {
  scaleX: number;
  scaleY: number;
  imageScaleX: number;
  imageScaleY: number;
};

export const BOX_WIDTH = 640 as const;
export const BOX_HEIGHT = 416 as const;

export const calculateDistance = (box1: BoundingBox, box2: BoundingBox) => {
  const center1 = [(box1[0] + box1[2]) / 2, (box1[1] + box1[3]) / 2];
  const center2 = [(box2[0] + box2[2]) / 2, (box2[1] + box2[3]) / 2];

  return Math.sqrt(
    (center1[0] - center2[0]) ** 2 + (center1[1] - center2[1]) ** 2
  );
};

export const calculateIoU = (box1: BoundingBox, box2: BoundingBox) => {
  const [x1, y1, x2, y2] = box1;
  const [x3, y3, x4, y4] = box2;

  const xA = Math.max(x1, x3);
  const yA = Math.max(y1, y3);
  const xB = Math.min(x2, x4);
  const yB = Math.min(y2, y4);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const box1Area = (x2 - x1) * (y2 - y1);
  const box2Area = (x4 - x3) * (y4 - y3);

  return interArea / (box1Area + box2Area - interArea);
};

export const calculateScaleFactor = (
  naturalWidth: number,
  naturalHeight: number,
  width: number,
  height: number
) =>
  ({
    scaleX: naturalWidth / BOX_WIDTH,
    scaleY: naturalHeight / BOX_HEIGHT,
    imageScaleX: naturalWidth / width,
    imageScaleY: naturalWidth / height,
  }) as ScaleFactor;

export const calculateRotatedBoxes = (
  boxes: BoundingBox[],
  { scaleX, scaleY }: ScaleFactor,
  naturalWidth: number,
  naturalHeight: number
) => {
  // 카메라는 도우위쪽이 멀고 사용자는 도우 아래쪽이 가깝기떄문에 y축에 대한 보정값을 추가해줌
  const correctionValueY = naturalHeight * 0.03 * scaleY;

  const scaleWidth = BOX_WIDTH * scaleX;
  const scaleHeight = BOX_HEIGHT * scaleY;
  const centerX = naturalWidth / 2;
  const centerY = naturalHeight / 2;

  return boxes.map(box => {
    const scaledX1 = box[0] * scaleX;
    const scaledX2 = box[2] * scaleX;
    const scaledY1 = box[1] * scaleY;
    const scaledY2 = box[3] * scaleY;

    return [
      scaleWidth - (centerX + (scaledX2 - centerX)),
      scaleHeight - (centerY + (scaledY2 - centerY)) - correctionValueY,
      scaleWidth - (centerX + (scaledX1 - centerX)),
      scaleHeight - (centerY + (scaledY1 - centerY)) - correctionValueY,
    ] as BoundingBox;
  });
};
