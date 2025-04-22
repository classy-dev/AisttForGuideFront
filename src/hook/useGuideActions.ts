import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import guideSlice from 'SliceFarm/guide';
import messageQueueSlice from 'SliceFarm/messageQueue';
import { useAppDispatch } from 'StoreFarm/index';
import useAisttSocketEvents, {
  GuideDirection,
} from 'HookFarm/useAisttSocketEvents';

interface useGuideActionsProps {
  direction?: GuideDirection;
  isLastStep?: boolean;
  skipProcess?: boolean;
}

const useGuideActions = ({
  direction = GuideDirection['NONE'],
  isLastStep = false,
  skipProcess = false,
}: useGuideActionsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { emitGuideEnd, emitGuideExit } = useAisttSocketEvents({
    direction,
    skipProcess,
  });

  const handleNextStep = useCallback(() => {
    if (isLastStep) {
      dispatch(messageQueueSlice.actions.nextStep());
      emitGuideEnd();
    } else {
      dispatch(guideSlice.actions.nextStep());
      dispatch(messageQueueSlice.actions.nextStep());
    }
  }, [isLastStep, emitGuideEnd, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(guideSlice.actions.initialize());
    navigate(-1);
  }, [dispatch, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    handleNextStep,
    handleClose,
    handleBack,
    emitGuideEnd,
    emitGuideExit,
  };
};

export default useGuideActions;
