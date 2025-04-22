import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

// Components
import Progress from 'Root/src/component/guide/Progress';
import { ToppingSteps } from 'Root/src/component/guide/ToppingSteps';
import guideSlice from 'SliceFarm/guide';
import { useAppDispatch } from 'StoreFarm/index';
import { Button } from 'ComponentFarm/Button';
import ButtonCounter from 'ComponentFarm/guide/ButtonCounter';
import CurrentTopping from 'ComponentFarm/guide/CurrentTopping';
import DoughStepModal from 'ComponentFarm/guide/DoughStepModal';
import MessageQueue from 'ComponentFarm/guide/MessageQueue';
import PreloadImages from 'ComponentFarm/guide/PreloadImages';
import ResultModal from 'ComponentFarm/guide/ResultModal';
import { GuideWrapper } from 'ComponentFarm/guide/style';
import UsedNotificationModal from 'ComponentFarm/guide/UsedNotificationModal';
import GuideImageProcessingView from 'ComponentFarm/visual/GuideImageProcessingView';

// Types
import { GuideDirection } from 'HookFarm/useAisttSocketEvents';

// Hooks
import useGuideActions from 'HookFarm/useGuideActions';
import useGuideEffects from 'HookFarm/useGuideEffects';
import useGuideNavigation from 'HookFarm/useGuideNavigation';
import useGuideProgress from 'HookFarm/useGuideProgress';
import useGuideState from 'HookFarm/useGuideState';
import { useFetchMenu } from 'HookFarm/useMenu';

// Types
interface StepInfo {
  ai_step_code: string;
  task: string;
  required_value: number;
}

const Guide = () => {
  // Custom Hooks
  const dispatch = useAppDispatch();
  const { menuId, direction } = useParams<{
    menuId: string;
    direction: string;
  }>();
  const { guideInfo, isDev, fragmentComplete } = useGuideState();
  const { currentProgress, progressPercentage } = useGuideProgress();
  const { menuIdNumber, directionValue, isValidRoute } = useGuideNavigation(
    menuId,
    direction
  );

  const { handleNextStep, handleClose, handleBack, emitGuideExit } =
    useGuideActions({
      direction: directionValue,
      isLastStep: guideInfo.currentStep === guideInfo.topping_steps.length - 1,
      skipProcess:
        guideInfo.topping_steps[guideInfo.currentStep]?.task?.indexOf('skip_') >
        -1,
    });

  useFetchMenu(menuIdNumber, {
    onSuccess: data => {
      if (!data?.attributes?.use_guide) {
        return handleBack();
      }
      dispatch(guideSlice.actions.setMenuData(data.attributes));
    },
    onError: handleBack,
  });

  // Effects
  useGuideEffects({
    onReset: () => guideInfo.isStart && emitGuideExit(),
  });

  // Memoized Values
  const currentStepInfo = React.useMemo<StepInfo>(
    () => guideInfo.topping_steps[guideInfo.currentStep],
    [guideInfo.topping_steps, guideInfo.currentStep]
  );

  const isDoughStep = React.useMemo(
    () => Number(currentStepInfo?.ai_step_code) === 26,
    [currentStepInfo]
  );

  const isFragmentComplete = React.useMemo(
    () => (isDoughStep ? true : fragmentComplete),
    [isDoughStep, fragmentComplete]
  );

  const { canNextStep, canNextStepCount, isLastStep, isSkipStep } =
    React.useMemo(
      () => ({
        canNextStep:
          !guideInfo.isEnd &&
          (currentStepInfo?.task === 'segmentation'
            ? progressPercentage >= 90
            : progressPercentage >= 100),
        canNextStepCount:
          isFragmentComplete &&
          !guideInfo.isEnd &&
          (currentStepInfo?.task === 'segmentation'
            ? progressPercentage >= 95
            : progressPercentage >= 100),
        isLastStep:
          guideInfo.currentStep === guideInfo.topping_steps.length - 1,
        isSkipStep:
          guideInfo.topping_steps[guideInfo.currentStep]?.task?.indexOf(
            'skip_'
          ) > -1,
      }),
      [guideInfo, progressPercentage, isFragmentComplete, currentStepInfo]
    );

  if (!isValidRoute) {
    return <Navigate to={`/${direction}/${menuId}`} />;
  }

  return (
    <GuideWrapper>
      <PreloadImages />
      <GuideContent
        direction={direction ?? 'none'}
        guideInfo={guideInfo}
        currentStep={guideInfo.currentStep}
      />
      <GuideSidebar
        currentStepInfo={currentStepInfo}
        progressPercentage={progressPercentage}
        currentProgress={currentProgress}
        canNextStep={isSkipStep ? true : canNextStep}
        canNextStepCount={isSkipStep ? true : canNextStepCount}
        isLastStep={isLastStep}
        isDev={isDev}
        nextSecond={isSkipStep ? 30 : 3}
        onNextStep={handleNextStep}
      />
      <GuideModals
        guideInfo={guideInfo}
        isDoughStep={isDoughStep}
        isDev={isDev}
        onClose={handleClose}
        onBack={handleBack}
        onNextStep={handleNextStep}
      />
    </GuideWrapper>
  );
};

// Sub-components
const GuideContent = ({
  direction,
  guideInfo,
  currentStep,
}: {
  direction: string;
  guideInfo: any;
  currentStep: number;
}) => (
  <div className="guide-content">
    <div className="absolute left-0 top-0 h-full w-full flex flex-col items-start">
      <ToppingSteps
        currentStep={currentStep}
        toppingSteps={guideInfo.topping_steps}
        stepProgresses={guideInfo.stepProgresses}
      />
      <GuideImageProcessingView
        direction={
          GuideDirection[
            (direction?.toUpperCase() as 'LEFT' | 'RIGHT') ?? 'NONE'
          ]
        }
      />
      <MessageQueue />
    </div>
  </div>
);

const GuideSidebar: React.FC<{
  currentStepInfo: StepInfo;
  progressPercentage: number;
  currentProgress: number;
  canNextStep: boolean;
  canNextStepCount: boolean;
  nextSecond: number;
  isLastStep: boolean;
  isDev: boolean;
  onNextStep: () => void;
}> = ({
  currentStepInfo,
  progressPercentage,
  currentProgress,
  canNextStep,
  canNextStepCount,
  isLastStep,
  isDev,
  nextSecond,
  onNextStep,
}) => (
  <div className="flex-none w-[180px] lg:w-[220px] flex flex-col h-full ml-default gap-y-[1.2rem]">
    <CurrentTopping />
    <Progress
      progress={progressPercentage}
      current={currentProgress}
      max={currentStepInfo?.required_value ?? 100}
      unit={currentStepInfo?.task === 'detection' ? '개' : '%'}
      onComplete={() => {}}
    />
    <NextStepButton
      key={nextSecond}
      disabled={isDev ? false : !canNextStep}
      showCounter={!isDev && canNextStepCount}
      isLastStep={isLastStep}
      nextSecond={nextSecond}
      onNextStep={onNextStep}
    />
  </div>
);

const NextStepButton: React.FC<{
  disabled: boolean;
  showCounter: boolean;
  isLastStep: boolean;
  nextSecond: number;
  onNextStep: () => void;
}> = ({ disabled, showCounter, isLastStep, nextSecond, onNextStep }) => (
  <Button
    type="button"
    disabled={disabled}
    onClick={onNextStep}
    className="flex items-center justify-center w-full text-3xl bg-[#2264E5] h-[7.8rem] rounded-[0.6rem] transition-colors text-white font-medium disabled:bg-[#B2DDFF] disabled:text-white disabled:cursor-not-allowed"
  >
    {isLastStep ? '종료' : '다음 단계 이동'}
    {showCounter && (
      <ButtonCounter
        nextSecond={nextSecond}
        sound={nextSecond === 3}
        onNext={onNextStep}
      />
    )}
  </Button>
);

const GuideModals: React.FC<{
  guideInfo: any;
  isDoughStep: boolean;
  isDev: boolean;
  onClose: () => void;
  onBack: () => void;
  onNextStep: () => void;
}> = ({ guideInfo, isDoughStep, isDev, onClose, onBack, onNextStep }) => (
  <>
    <ResultModal
      show={guideInfo.isEnd}
      menuName={guideInfo.menu_name}
      onClose={onClose}
    />
    <DoughStepModal
      fullScreen={!isDev}
      show={guideInfo.isStart && isDoughStep}
      onClose={onNextStep}
    />
    <UsedNotificationModal show={guideInfo.isPending} onBack={onBack} />
  </>
);

export default Guide;
