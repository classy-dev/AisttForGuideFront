import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { RootState } from 'StoreFarm/reducer';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import ToppingCheck from 'ComponentFarm/icon/ToppingCheck';
import { throttleEvent } from 'UtilFarm/event';
import { renderSegmentWithD3 } from 'UtilFarm/visual/d3';
import {
  calculateNonZeroCentroid,
  fromImageDataTo2DUnitArray,
  getComputedDataFromHitmap,
} from 'UtilFarm/visual/segmentData';

const Fade = keyframes`
  0% {
    opacity: 0;
  }
  
  100% {
    opacity: 1;
  }
`;

const SegmentationObjectWrapper = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms ease-in-out;
  pointer-events: none;

  .fade {
    animation: ${Fade} 1000ms ease-in-out infinite alternate;
  }

  .visual-svg {
    position: absolute;
    top: 0;
    left: 0;
  }

  .visual {
    position: relative;
    width: 100%;
    height: 100%;
    transition: opacity 300ms ease-in-out;
    opacity: 0.8;
  }

  .line {
    opacity: 1;
  }

  .line path {
    transition: stroke 300ms ease-in-out;
  }

  .progress {
    position: absolute;
    font-size: 2.2rem;
    font-weight: bold;
    color: #fff;
    z-index: 2;
  }

  .progress svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &.complete {
    z-index: 2;

    .visual {
      opacity: 0;
    }

    .line path {
      fill: rgba(255, 255, 255, 0.5) !important;
      stroke: rgba(255, 255, 255, 0.5) !important;
      stroke-width: 0 !important;
    }
  }
`;

interface SegmentObjectProps {
  fragmentIdx: number;
  left: number;
  top: number;
  width: number;
  height: number;
  baseFragment: ImageData;
  colorFragment: ImageData;
  fragmentRequiredValue?: number; // 임계값
  onComplete: (fragmentIdx: number) => void;
  onExclude?: (fragmentIdx: number) => void;
}

const CompleteCheckIcon = ({ show }: { show: boolean }) => {
  return (
    <CSSTransition
      classNames="scale-fade"
      in={!!show}
      mountOnEnter
      unmountOnExit
      addEndListener={(node, done) =>
        node.addEventListener('transitionend', done)
      }
    >
      <ToppingCheck />
    </CSSTransition>
  );
};

const SegmentationObject = ({
  fragmentIdx,
  left,
  top,
  width,
  height,
  baseFragment,
  colorFragment,
  fragmentRequiredValue,
  onComplete,
  onExclude,
}: SegmentObjectProps) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const svgBorderRef = React.useRef<SVGSVGElement>(null);
  const progressCntRefs = React.useRef(0);

  const [progress, setProgress] = React.useState(0);
  const [complete, setComplete] = React.useState(false);
  const [exclude, setExclude] = React.useState(false);

  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );

  const hitmap = useMemo(
    () => fromImageDataTo2DUnitArray(baseFragment),
    [baseFragment]
  );

  const data = useMemo(
    () => getComputedDataFromHitmap(baseFragment, colorFragment, hitmap),
    [baseFragment, colorFragment]
  );

  const center = useMemo(
    () =>
      calculateNonZeroCentroid(data, baseFragment.width, baseFragment.height),
    [baseFragment]
  );

  const checkProgress = React.useCallback((progress: number) => {
    if (progress >= 95 && progressCntRefs.current >= 2) {
      setComplete(true);
    } else if (progress >= 95) {
      progressCntRefs.current += 1;
    } else {
      progressCntRefs.current = 0;
    }
  }, []);

  const calculateProgress = useCallback(
    throttleEvent((data: Uint8Array) => {
      let total = 0;
      let progress = 0;

      data.forEach(d => {
        if (d === 2) {
          total++;
          progress++;
        } else if (d === 1) {
          total++;
        }
      });

      const calculatedProgress = Math.min(
        Math.round(
          ((100 - (progress / total) * 100) / (fragmentRequiredValue ?? 100)) *
            100
        ),
        100
      );

      if (total === 0 && progress === 0 && !exclude) {
        setExclude(true);
        return;
      }

      setProgress(calculatedProgress);
      if (typeof fragmentRequiredValue !== 'undefined')
        checkProgress(calculatedProgress);
    }, 500),
    [fragmentRequiredValue, complete]
  );

  useEffect(() => {
    if (exclude) {
      return;
    }

    calculateProgress(data);
  }, [data, exclude]);

  useLayoutEffect(() => {
    if (exclude) {
      onExclude?.(fragmentIdx);
    }
  }, [exclude, fragmentIdx]);

  // onComplete
  useLayoutEffect(() => {
    if (complete) onComplete(fragmentIdx);
  }, [complete, fragmentIdx]);

  // Render color segment with d3
  useLayoutEffect(() => {
    if (!svgRef.current) return;
    renderSegmentWithD3(
      {
        data,
        svgElement: svgRef.current,
        threshold: [1.5],
        segmentWidth: baseFragment.width,
        segmentHeight: baseFragment.height,
        containerWidth: width,
        containerHeight: height,
      },
      {
        fill: 'yellow',
        stroke: 'none',
        'stroke-width': '0',
        opacity: '0.75',
      }
    );
  }, [data, width, height]);

  // Render base segment with d3
  useLayoutEffect(() => {
    if (!svgBorderRef.current) return;

    renderSegmentWithD3(
      {
        data: data.map(d => (d > 0 ? 1 : 0)),
        svgElement: svgBorderRef.current,
        threshold: [0.5],
        segmentWidth: baseFragment.width,
        segmentHeight: baseFragment.height,
        containerWidth: width,
        containerHeight: height,
      },
      {
        fill: 'transparent',
        stroke: 'none',
        opacity: '1',
        'stroke-width': '0',
      }
    );
  }, [baseFragment]);

  return (
    <SegmentationObjectWrapper
      className={complete ? 'complete' : ''}
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      <div className="visual">
        <svg
          ref={svgRef}
          className="visual-svg area fade"
          width={width}
          height={height}
        />
      </div>
      <svg
        ref={svgBorderRef}
        className="visual-svg line"
        width={width}
        height={height}
      />

      <span
        className="progress"
        style={{
          left: center.x * 3,
          top: center.y * 3,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {isDev && (
          <span style={{ position: 'relative', top: '4rem' }}>
            {progress}%{fragmentRequiredValue && `[${fragmentRequiredValue}]`}
          </span>
        )}
        {!exclude && <CompleteCheckIcon show={complete} />}
      </span>
    </SegmentationObjectWrapper>
  );
};

export default SegmentationObject;
