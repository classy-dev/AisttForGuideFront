import { useMemo } from 'react';
import { BoundingBox } from 'UtilFarm/visual/boundingBox';

const useAdjustBoundingBox = (
  box: BoundingBox | null,
  minWidth: number,
  minHeight: number
) => {
  return useMemo(() => {
    if (!box) return null;

    const adjustedWidth = Math.max(box[2] - box[0], minWidth);
    const adjustedHeight = Math.max(box[3] - box[1], minHeight);

    const centerX = box[0] + (box[2] - box[0]) / 2;
    const centerY = box[1] + (box[3] - box[1]) / 2;

    return [
      centerX - adjustedWidth / 2, // 왼쪽 경계
      centerY - adjustedHeight / 2, // 위쪽 경계
      centerX + adjustedWidth / 2, // 오른쪽 경계
      centerY + adjustedHeight / 2, // 아래쪽 경계
    ] as BoundingBox;
  }, [box, minWidth, minHeight]);
};

export default useAdjustBoundingBox;
