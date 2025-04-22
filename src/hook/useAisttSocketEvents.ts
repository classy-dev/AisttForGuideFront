import React from 'react';
import { useSelector } from 'react-redux';
import guideSlice from 'SliceFarm/guide';
import messageQueueSlice from 'SliceFarm/messageQueue';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import { guideEnd, guideProcess, guideStart } from 'ApiFarm/guide';
import { IMenu } from 'InterfaceFarm/menu';
import { BoundingBox } from 'UtilFarm/visual/boundingBox';

// Constants
const FPS = 1000 / 3;
const START_CHECK_INTERVAL = 1000;

// Types
export enum GuideDirection {
  NONE = -1,
  LEFT = 0,
  RIGHT = 1,
}

interface GuideProcessResponse {
  current_step: number;
  progress_seg: number;
  progress_dec: number;
  topping_boxes: BoundingBox[]; // Consider defining a proper type
  current_weight: number;
  alert?: string;
}

interface StepInfo {
  ai_step_code: string;
  task: string;
  alerts?: IMenu['topping_steps'][number]['alerts'];
}

interface UseAisttEventsProps {
  direction: GuideDirection;
  skipProcess?: boolean;
}

// Custom hooks for state management
const useGuideState = () => {
  return {
    checkStart: useSelector((state: RootState) => state.guide.isStart),
    checkEnd: useSelector((state: RootState) => state.guide.isEnd),
    menuId: useSelector((state: RootState) =>
      parseInt(state.guide.ai_menu_code)
    ),
    step: useSelector((state: RootState) => state.guide.currentStep),
    toppingSteps: useSelector((state: RootState) => state.guide.topping_steps),
  };
};

const useGuideAisttEvents = ({
  direction,
  skipProcess = false,
}: UseAisttEventsProps) => {
  const dispatch = useAppDispatch();
  const isConnected = true;

  const { checkStart, checkEnd, menuId, step, toppingSteps } = useGuideState();

  // Memoized values
  const stepInfo = React.useMemo<StepInfo | undefined>(
    () => toppingSteps?.[step],
    [toppingSteps, step]
  );

  const ai_step_code = React.useMemo(
    () => parseInt(stepInfo?.ai_step_code ?? '-1'),
    [stepInfo]
  );

  const isFrontReady = React.useMemo(
    () => !isNaN(menuId) && menuId !== -1,
    [menuId]
  );

  // Handlers
  const handleGuideEnd = React.useCallback(async () => {
    try {
      const res = await guideEnd(direction);
      if (res.status === 200) {
        dispatch(guideSlice.actions.complete());
      }
    } catch (error) {
      console.error('GUIDE END ERROR:', error);
    }
  }, [direction, dispatch]);

  const handleGuideExit = React.useCallback(async () => {
    try {
      return await guideEnd(direction);
    } catch (error) {
      console.error('GUIDE EXIT ERROR:', error);
    }
  }, [direction]);

  const handleProgressUpdate = React.useCallback(
    (checkData: GuideProcessResponse, task: string) => {
      const progress =
        task === 'segmentation'
          ? checkData.progress_seg
          : checkData.progress_dec;

      dispatch(
        guideSlice.actions.setProgress({
          progress,
          topping_boxes: checkData.topping_boxes,
        })
      );
      dispatch(guideSlice.actions.setWeight(checkData.current_weight));
    },
    [dispatch]
  );

  const handleAlert = React.useCallback(
    (checkData: GuideProcessResponse, alerts?: StepInfo['alerts']) => {
      if (checkData.alert && checkData.alert !== 'lack_amount') {
        const message = alerts?.[checkData.alert] ?? checkData.alert;
        dispatch(
          messageQueueSlice.actions.push({
            type: 'warning',
            message: String(message),
          })
        );
      }
    },
    [dispatch]
  );

  const handleGuideProcess = React.useCallback(async () => {
    if (!isConnected || !isFrontReady || !checkStart) return;

    try {
      const res = await guideProcess({
        direction,
        current_step: ai_step_code,
      });

      const checkData = res.data;
      if (ai_step_code !== checkData.current_step || stepInfo?.task === 'pass')
        return;

      handleProgressUpdate(checkData, stepInfo?.task ?? '');
      handleAlert(checkData, stepInfo?.alerts);
    } catch (error) {
      console.error('CHECK EVENT ERROR:', error);
    }
  }, [
    isConnected,
    isFrontReady,
    checkStart,
    direction,
    ai_step_code,
    stepInfo,
    handleProgressUpdate,
    handleAlert,
  ]);

  // Start check effect
  React.useEffect(() => {
    if (!isConnected || !isFrontReady || checkStart || checkEnd) return;

    const handleStartCheck = async () => {
      try {
        const res = await guideStart({
          direction,
          menu_idx: menuId,
        });

        if (res.status === 200) {
          if (res.data.is_ready) {
            dispatch(guideSlice.actions.start());
          } else if (res.data.is_used) {
            dispatch(guideSlice.actions.setPending(res.data.is_used));
          }
        }
      } catch (error) {
        console.error('START CHECK ERROR:', error);
        if (import.meta.env.NODE_ENV === 'development') {
          dispatch(guideSlice.actions.start());
        }
      }
    };

    const startCheckTimer = setInterval(handleStartCheck, START_CHECK_INTERVAL);

    return () => clearInterval(startCheckTimer);
  }, [
    isConnected,
    isFrontReady,
    menuId,
    direction,
    checkStart,
    checkEnd,
    dispatch,
  ]);

  // Process check effect
  React.useEffect(() => {
    if (!isConnected || !isFrontReady || !checkStart || skipProcess) return;

    let unmounted = false;
    const checkTimer = setInterval(
      () => !unmounted && handleGuideProcess(),
      FPS
    );

    return () => {
      unmounted = true;
      clearInterval(checkTimer);
    };
  }, [isConnected, isFrontReady, checkStart, skipProcess, handleGuideProcess]);

  return {
    emitGuideEnd: handleGuideEnd,
    emitGuideExit: handleGuideExit,
    emitGuideProcess: handleGuideProcess,
  };
};

export default useGuideAisttEvents;
