import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { getFragmentImageData } from 'UtilFarm/visual/segmentImage';
import { segmentPresetW } from 'UtilFarm/visual/segmentPreset';
import GuideLine from './GuideLine';
import SegmentationObject from './SegmentationObject';

const fragmentSound = new Audio('/audio/fragment.mp3');

const DevWrapper = styled.div`
  position: fixed;
  right: 25.6rem;
  top: 8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  span {
    font-weight: 600;
    color: white;
  }

  div {
    padding: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: gray;
    border-radius: 0.4rem;
  }

  canvas {
    max-width: 20rem;
  }
`;

interface Props {
  width: number;
  height: number;
  left: number;
  top: number;
  baseImageData: ImageData;
  colorImageData: ImageData;
}

// 640 x 416 기준 좌표
const STATIC_FRAGMENT_POSITIONS = [
  [0, 0], // [left,top]
  [64, 0],
  [203, 0],
  [320, 0],
  [448, 0],
];

/**
 * SegmentationRender 컴포넌트는 ...
 */
const SegmentationView = ({
  left,
  top,
  width,
  height,
  baseImageData,
  colorImageData,
}: Props) => {
  const presetW = useMemo(
    () => segmentPresetW(baseImageData.width, baseImageData.height),
    [baseImageData]
  );

  const fragmentPositions = useMemo(() => {
    const scale = width / 640;
    return STATIC_FRAGMENT_POSITIONS.map(([x, y]) => [x * scale, y * scale]);
  }, []);

  const scaleX = width / baseImageData.width;
  const scaleY = height / baseImageData?.height;

  const [baseSegmentList, setBaseSegmentList] = useState<ImageData[]>([]);
  const [colorSegmentList, setColorSegmentList] = useState<ImageData[]>([]);

  const getFragmentList = useCallback(
    async (imageData: ImageData) => getFragmentImageData(imageData, presetW),
    [presetW]
  );

  const validateImageData = useCallback(
    (imageData: ImageData) => imageData.width > 1 && imageData.height > 1,
    []
  );

  useLayoutEffect(() => {
    validateImageData(baseImageData) &&
      getFragmentList(baseImageData).then(setBaseSegmentList);
  }, [baseImageData, getFragmentList]);

  useLayoutEffect(() => {
    validateImageData(colorImageData) &&
      getFragmentList(colorImageData).then(setColorSegmentList);
  }, [colorImageData, getFragmentList]);

  const segmentList = useMemo(
    () =>
      baseSegmentList.map((baseSegment, idx) => ({
        baseSegment,
        colorSegment: colorSegmentList[idx],
      })),
    [baseSegmentList, colorSegmentList]
  );

  return (
    <div style={{ position: 'absolute', left, top, zIndex: 1, width, height }}>
      {segmentList.map((segments, idx) => (
        <SegmentationObject
          key={idx}
          fragmentIdx={idx}
          left={Math.round(fragmentPositions[idx][0])}
          top={Math.round(fragmentPositions[idx][1])}
          width={segments.baseSegment.width * scaleX}
          height={segments.baseSegment.height * scaleY}
          baseFragment={segments.baseSegment}
          colorFragment={segments.colorSegment}
          onComplete={() => {}}
          onExclude={() => {}}
        />
      ))}
      <GuideLine baseImage={baseImageData} width={width} height={height} />
    </div>
  );
};

export default SegmentationView;
