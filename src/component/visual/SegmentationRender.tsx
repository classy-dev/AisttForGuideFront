import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import guideSlice from 'SliceFarm/guide';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import { debounceEvent } from 'UtilFarm/event';
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

const FRAGMENT_STATUS = {
  EXCLAUDE: 0,
  INCOMPLETE: 1,
  COMPLETE: 2,
};

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
const SegmentationRender = ({
  left,
  top,
  width,
  height,
  baseImageData,
  colorImageData,
}: Props) => {
  const dispatch = useAppDispatch();
  const baseImageDataRef = useRef<HTMLCanvasElement>(null);
  const colorImageDataRef = useRef<HTMLCanvasElement>(null);

  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );
  const currentStep = useSelector(
    (state: RootState) => state.guide.topping_steps[state.guide.currentStep]
  );

  const fragmentRequiredValue = useMemo(
    () =>
      currentStep.fragment_required_value === 0 ||
      !currentStep.fragment_required_value
        ? currentStep.required_value
        : currentStep.fragment_required_value,
    [currentStep]
  );

  const presetW = useMemo(
    () => segmentPresetW(baseImageData.width, baseImageData.height),
    [baseImageData]
  );

  const fragmentPositions = useMemo(() => {
    const scale = width / 640;
    return STATIC_FRAGMENT_POSITIONS.map(([x, y]) => [x * scale, y * scale]);
  }, [width]);

  const scaleX = width / baseImageData.width;
  const scaleY = height / baseImageData?.height;

  const [baseSegmentList, setBaseSegmentList] = useState<ImageData[]>([]);
  const [colorSegmentList, setColorSegmentList] = useState<ImageData[]>([]);

  const fragmentStatues = useMemo(
    () => baseSegmentList.map(() => 1),
    [baseSegmentList]
  );

  const devImageRender = useCallback(() => {
    const baseCanvas = baseImageDataRef.current;
    const colorCanvas = colorImageDataRef.current;

    if (!baseCanvas || !colorCanvas) return;

    const baseCtx = baseCanvas.getContext('2d');
    const colorCtx = colorCanvas.getContext('2d');

    if (!baseCtx || !colorCtx) return;

    baseCtx.putImageData(baseImageData, 0, 0);
    colorCtx.putImageData(colorImageData, 0, 0);
  }, [baseImageData, colorImageData]);

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

  useLayoutEffect(() => {
    if (isDev) devImageRender();
  }, [baseSegmentList, colorSegmentList]);

  const playCompleteAudioWithDebounce = useCallback(
    debounceEvent(() => fragmentSound.play(), 500),
    []
  );

  const checkFragmentStatus = useCallback(
    (fragmentIdx: number) => {
      fragmentStatues[fragmentIdx] = FRAGMENT_STATUS.COMPLETE;
    },
    [fragmentStatues]
  );

  const excludeFragmentStatus = useCallback(
    (fragmentIdx: number) => {
      fragmentStatues[fragmentIdx] = FRAGMENT_STATUS.EXCLAUDE;
    },
    [fragmentStatues]
  );

  const checkAllFragmentStatus = useCallback(
    debounceEvent(() => {
      const isAllComplete = fragmentStatues
        .filter(status => status !== FRAGMENT_STATUS.EXCLAUDE)
        .every(status => status === FRAGMENT_STATUS.COMPLETE);

      if (isAllComplete) {
        dispatch(guideSlice.actions.setFragmentComplete(true));
      }
    }, 500),
    [fragmentStatues, dispatch]
  );

  return (
    <div style={{ position: 'absolute', left, top, zIndex: 1, width, height }}>
      {baseSegmentList.map((segment, idx) => (
        <SegmentationObject
          key={idx}
          fragmentIdx={idx}
          left={Math.round(fragmentPositions[idx][0])}
          top={Math.round(fragmentPositions[idx][1])}
          width={segment.width * scaleX}
          height={segment.height * scaleY}
          baseFragment={segment}
          colorFragment={colorSegmentList[idx]}
          fragmentRequiredValue={fragmentRequiredValue}
          onComplete={idx => {
            checkFragmentStatus(idx);
            playCompleteAudioWithDebounce();
            checkAllFragmentStatus();
          }}
          onExclude={excludeFragmentStatus}
        />
      ))}
      <GuideLine baseImage={baseImageData} width={width} height={height} />
      {isDev && (
        <DevWrapper>
          <div>
            <span>baseImage</span>
            <canvas
              ref={baseImageDataRef}
              width={baseImageData.width}
              height={baseImageData.height}
            />
          </div>
          <div>
            <span>colorImage</span>
            <canvas
              ref={colorImageDataRef}
              width={colorImageData.width}
              height={colorImageData.height}
            />
          </div>
        </DevWrapper>
      )}
    </div>
  );
};

export default SegmentationRender;
