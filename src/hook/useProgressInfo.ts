import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

const useProgressInfo = () => {
  const guideInfo = useSelector((state: RootState) => state.guide);
  const currentStepInfo = useMemo(
    () => guideInfo.topping_steps[guideInfo.currentStep],
    [guideInfo.topping_steps, guideInfo.currentStep]
  );

  const initialValue = useMemo(
    () => currentStepInfo?.initial_value ?? 0,
    [currentStepInfo]
  );

  const requiredValue = useMemo(
    () => (currentStepInfo?.required_value ?? 100) - initialValue,
    [currentStepInfo, initialValue]
  );

  const currentProgress = useMemo(
    () => Math.max((guideInfo?.currentProgress ?? 0) - initialValue, 0),
    [guideInfo.currentProgress, requiredValue]
  );

  const progressPercentage = useMemo(
    () =>
      Math.min(
        (currentProgress / requiredValue) * 100,
        // safe max 100%
        100
      ),

    [currentProgress, requiredValue]
  );

  return {
    currentProgress: isNaN(currentProgress) ? 0 : currentProgress,
    progressPercentage: isNaN(progressPercentage) ? 0 : progressPercentage,
  };
};

export default useProgressInfo;
