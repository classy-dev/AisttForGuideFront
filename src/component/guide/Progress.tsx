import React, { useEffect, useLayoutEffect, useRef } from 'react';
import anime from 'animejs';
import { throttleEvent } from 'UtilFarm/event';
import { ProgressWrap } from './style';

interface ProgressProps {
  loading?: boolean;
  progress: number; // 100분위(%) 단위로 입력
  current: number;
  max: number;
  unit: string;
  onComplete: (value: number) => void;
}

const durationProp = {
  350: '!duration-[350ms]',
};

const duration = 350;

const Progress = ({ progress, current, unit, onComplete }: ProgressProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const valueWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef<typeof onComplete>(onComplete);

  const [containerHeight, setContainerHeight] = React.useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const rangeValueWrapper = [valueWrapperRef.current];
    const rangeValue = [textWrapperRef.current];
    const text = textWrapperRef.current?.innerText ?? '0';
    // text animation
    anime.remove(rangeValue);
    anime({
      targets: rangeValue,
      innerText: [text, unit === '%' ? progress : current],
      round: 1,
      duration: duration,
      easing: 'linear',
    });
  }, [progress]);

  React.useLayoutEffect(() => {
    const resize = throttleEvent(
      () => setContainerHeight(wrapperRef?.current?.clientHeight ?? 0),
      100
    );
    window.addEventListener('resize', resize);
    setContainerHeight(wrapperRef?.current?.clientHeight ?? 0);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    /**  Wrapper for the range input slider  */
    <ProgressWrap>
      <div className="progress_wrapper" ref={wrapperRef}>
        <div
          className={`range__slider transition-all ${durationProp[duration]}`}
          style={{ height: `${progress}%` }}
        >
          <div
            className="range__bg-pattern"
            style={{ height: containerHeight }}
          />
        </div>
        <div
          className={`range__values transition-all ${durationProp[duration]}`}
          ref={valueWrapperRef}
        >
          <div
            className={`range__value range__value text-[#2264E5] transition-transform`}
          >
            <span className="range__value__number" ref={textWrapperRef}>
              0
            </span>
            <span className="range__value__number range__value__number-unit">
              <span className="range__value__unit">{unit}</span>
            </span>
            {/**  Some text for the `top` value  */}
          </div>
        </div>
      </div>
    </ProgressWrap>
  );
};

export default Progress;
