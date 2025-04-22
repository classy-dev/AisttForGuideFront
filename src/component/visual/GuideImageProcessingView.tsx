import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import { DoughRect } from 'UtilFarm/visual/image';
import { ColormapRenderer } from './ColormapRenderer';
import DetectionRender from './DetectionRender';
import DrizzleAnimation from './DrizzleAnimation';
import GuideImage from './GuideImage';
import PowderAnimation from './PowderAnimation';
import SegmentationRender from './SegmentationRender';

const GuideImageProcessingViewStyle = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    display: inline-flex;
    position: relative;
    max-width: 1100px;
    width: 85%;
  }

  &.fade-enter,
  .fade-enter {
    opacity: 0;
  }

  &.fade-enter-active,
  .fade-enter-active {
    opacity: 1;
    transition: opacity 250ms;
  }

  &.fade-exit,
  .fade-exit {
    opacity: 1;
  }

  &.fade-exit-active,
  .fade-exit-active {
    opacity: 0;
    transition: opacity 250ms;
  }

  .slide-enter {
    opacity: 0;
    transform: translateX(25%);
  }

  .slide-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition:
      transform 250ms,
      opacity 250ms;
  }

  .slide-exit {
    opacity: 1;
    transform: translateX(0%);
  }

  .slide-exit-active {
    opacity: 0;
    transform: translateX(-25%);
    transition:
      transform 250ms,
      opacity 250ms;
  }
`;

const GuideImageProcessingView = ({ direction }: { direction: number }) => {
  const allowColormapCount = useRef(0);
  const colorImageRef = useRef<ImageData | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  const guideInfo = useSelector((state: RootState) => state.guide);

  const [doughRect, setDoughRect] = useState<DoughRect | null>(null);
  const [isEntered, setIsEntered] = useState(true);

  const currentStepInfo = useMemo(
    () => guideInfo.topping_steps?.[guideInfo?.currentStep],
    [guideInfo, guideInfo.currentStep]
  );

  const isDoughStep = useMemo(
    () => Number(currentStepInfo?.ai_step_code) === 26,
    [currentStepInfo]
  );

  const currentStep = useMemo(
    () => guideInfo.topping_steps[guideInfo.currentStep],
    [guideInfo]
  );

  const shouldRender = useMemo(
    () => isEntered && !guideInfo.isEnd && doughRect,
    [isEntered, guideInfo.isEnd]
  );

  const checkReceiveImageWithInitialDelay = useCallback(
    (imageData: ImageData | null) => {
      if (!imageData) return;

      if (allowColormapCount.current < 5) {
        allowColormapCount.current += 1;
        if (!colorImageRef.current) {
          colorImageRef.current = new ImageData(1, 1);
        }
        setRenderCount(prev => prev + 1);
        return;
      }

      colorImageRef.current = imageData;
      setRenderCount(prev => prev + 1);
    },
    [currentStep]
  );

  useLayoutEffect(() => {
    setDoughRect(null);
    setRenderCount(0);

    allowColormapCount.current = 0;
    colorImageRef.current = null;
  }, [currentStep]);

  if (!currentStep || isDoughStep) return <GuideImageProcessingViewStyle />;

  return (
    <GuideImageProcessingViewStyle>
      <div className="content">
        <SwitchTransition>
          <CSSTransition
            key={currentStep.id}
            classNames="slide"
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done)
            }
            onEntered={() => setIsEntered(true)}
            onExit={() => setIsEntered(false)}
          >
            <GuideImage
              src={currentStep.gt_image}
              toppingArea={currentStep.topping_area}
              onLoad={setDoughRect}
            />
          </CSSTransition>
        </SwitchTransition>
        <SwitchTransition>
          <CSSTransition
            key={currentStep.id}
            in={!!shouldRender}
            classNames="slide"
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done)
            }
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              {currentStepInfo?.task === 'segmentation' && (
                <>
                  <ColormapRenderer
                    top={doughRect?.top ?? 0}
                    left={doughRect?.left ?? 0}
                    width={doughRect?.width ?? 0}
                    height={doughRect?.height ?? 0}
                    imageData={doughRect?.imageData ?? new ImageData(1, 1)}
                    stepCode={currentStep.ai_step_code}
                    direction={direction}
                    onLoadColorImage={checkReceiveImageWithInitialDelay}
                  />
                  <SegmentationRender
                    top={doughRect?.top ?? 0}
                    left={doughRect?.left ?? 0}
                    width={doughRect?.width ?? 0}
                    height={doughRect?.height ?? 0}
                    baseImageData={doughRect?.imageData ?? new ImageData(1, 1)}
                    colorImageData={
                      colorImageRef.current ?? new ImageData(1, 1)
                    }
                  />
                </>
              )}
              {currentStepInfo?.task === 'detection' && (
                <DetectionRender
                  left={doughRect?.left ?? 0}
                  top={doughRect?.top ?? 0}
                  width={doughRect?.width ?? 0}
                  height={doughRect?.height ?? 0}
                  naturalWidth={doughRect?.naturalWidth ?? 0}
                  naturalHeight={doughRect?.naturalHeight ?? 0}
                  positionInfo={currentStepInfo.detection_info}
                />
              )}
              {currentStepInfo?.task === 'skip_drizzle' && (
                <DrizzleAnimation
                  left={doughRect?.left ?? 0}
                  top={doughRect?.top ?? 0}
                  width={doughRect?.width ?? 0}
                  height={doughRect?.height ?? 0}
                />
              )}
              {currentStepInfo?.task === 'skip_powder' && (
                <PowderAnimation
                  left={doughRect?.left ?? 0}
                  top={doughRect?.top ?? 0}
                  width={doughRect?.width ?? 0}
                  height={doughRect?.height ?? 0}
                />
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </GuideImageProcessingViewStyle>
  );
};

export default GuideImageProcessingView;
