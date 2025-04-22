import { useAlertMessage } from 'HookFarm/useAlertMessage';
import useProgressInfo from 'HookFarm/useProgressInfo';

const useGuideProgress = () => {
  const { currentProgress, progressPercentage } = useProgressInfo();
  useAlertMessage(progressPercentage);

  return {
    currentProgress,
    progressPercentage,
  };
};

export default useGuideProgress;
