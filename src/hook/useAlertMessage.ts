import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import messageQueueSlice from 'SliceFarm/messageQueue';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import useProgressDeadlock from './useProgressDeadlock';

// Guide Info State 를 받아서 적절한 메세지를 사용자에게 출력하는 훅
export const useAlertMessage = (progress: number) => {
  const dispatch = useAppDispatch();
  const isDeadlock = useProgressDeadlock(progress, 18);

  const guideInfo = useSelector((state: RootState) => state.guide);
  const messsages = useSelector(
    (state: RootState) =>
      state.guide.topping_steps?.[state.guide?.currentStep]?.alerts
  );

  // warning message push 주기 관리
  const currentStep = useSelector(
    (state: RootState) => state.guide.currentStep
  );

  const stepInfo = useSelector(
    (state: RootState) => state.guide.topping_steps?.[state.guide?.currentStep]
  );

  const isFragmentComplete = useSelector(
    (state: RootState) => state.guide.fragmentComplete
  );

  const isSegmentationStep = useMemo(
    () => stepInfo?.task === 'segmentation',
    [stepInfo]
  );

  const isDetectionStep = useMemo(
    () => stepInfo?.task === 'detection',
    [stepInfo]
  );

  const isSkipStep = useMemo(
    () => stepInfo?.task?.indexOf('skip_') > -1,
    [stepInfo]
  );

  const isDoughStep = useSelector(
    (state: RootState) =>
      Number(
        state.guide.topping_steps?.[state.guide?.currentStep]?.ai_step_code
      ) === 26
  );

  // warning message push 주기 관리
  const canAlertPush = useSelector(
    (state: RootState) => state.messageQueue.canAlertPush
  );

  // step 변경 시 alert 메세지 10초동안 불가능
  useEffect(() => {
    dispatch(messageQueueSlice.actions.setAlertPush(false));
  }, [currentStep]);

  useEffect(() => {
    if (canAlertPush) return () => {};

    const timer = setTimeout(
      () => dispatch(messageQueueSlice.actions.setAlertPush(true)),
      10000
    );

    return () => clearTimeout(timer);
  }, [canAlertPush]);

  useEffect(() => {
    if (!isDeadlock || isSkipStep) {
      return;
    }
    const metarialName =
      stepInfo?.ingredient?.data?.attributes?.ingredient_name;
    const fragmentMessage = isSegmentationStep
      ? '조각별 토핑면적이 부족해요. 부족한 조각에 더 토핑해 주세요.'
      : `${metarialName} 토핑 위치를 화면에 화살표에 따라서 조정해주세요.`;

    const sendWarningMessage = () => {
      dispatch(
        messageQueueSlice.actions.push({
          type: 'warning',
          message:
            progress >= 90 && !isFragmentComplete && !isDoughStep
              ? fragmentMessage
              : messsages?.['lack_amount'] ?? '',
        })
      );
    };

    const timer = setInterval(sendWarningMessage, 10000);

    sendWarningMessage();

    return () => clearInterval(timer);
  }, [
    messsages,
    isDeadlock,
    isSkipStep,
    isDoughStep,
    isSegmentationStep,
    isDetectionStep,
    isFragmentComplete,
  ]);

  useEffect(() => {
    if (!guideInfo.isStart) return;

    const stepInfo = guideInfo.topping_steps[guideInfo.currentStep];
    const message = stepInfo?.alerts?.start || '';

    if (!message) return;

    if (guideInfo.currentStep === 0) {
      dispatch(
        messageQueueSlice.actions.push({
          type: 'alert',
          message,
        })
      );
    } else {
      dispatch(
        messageQueueSlice.actions.push({
          type: 'alert',
          beforeEffect: guideInfo.currentStep !== 0,
          effectType: 'nextstep',
          message,
        })
      );
    }

    // guideInfo.currentStep에 대한 변화 추적만 필요
    // eslint-disable-next-line
  }, [guideInfo.isStart, guideInfo.currentStep]);
};
