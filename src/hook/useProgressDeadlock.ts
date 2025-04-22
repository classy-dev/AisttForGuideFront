import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

const PROGRESS_THRESHOLD = 95;
const PROGRESS_CHECK_INTERVAL = 500; // milliseconds
const PROGRESS_STEP = 5;

// progress 교착 상태 확인 hook
const useProgressDeadlock = (progress: number, count: number) => {
  const guideInfo = useSelector((state: RootState) => state.guide);

  const [isDeadlocked, setIsDeadlocked] = useState(false);

  const prevProgress = useRef(progress);
  const deadlockCount = useRef(0);

  const isProgressStuck = (
    currentProgress: number,
    previousProgress: number
  ) => {
    return (
      currentProgress >= 0 &&
      !(currentProgress >= PROGRESS_THRESHOLD && guideInfo.fragmentComplete) &&
      Math.floor(currentProgress / PROGRESS_STEP) ===
        Math.floor(previousProgress / PROGRESS_STEP)
    );
  };

  const handleProgressCheck = () => {
    if (isProgressStuck(progress, prevProgress.current)) {
      deadlockCount.current += 1;
      if (deadlockCount.current > count && !isDeadlocked) {
        setIsDeadlocked(true);
        deadlockCount.current = 0;
      }
    } else {
      setIsDeadlocked(false);
      prevProgress.current = progress;
      deadlockCount.current = 0;
    }
  };

  const resetDeadlockState = () => {
    setIsDeadlocked(false);
    prevProgress.current = progress;
    deadlockCount.current = 0;
  };

  useEffect(() => {
    if (guideInfo.isEnd || !guideInfo.isStart) {
      resetDeadlockState();
      return;
    }

    const timer = setInterval(handleProgressCheck, PROGRESS_CHECK_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [
    progress,
    count,
    guideInfo.isEnd,
    guideInfo.isStart,
    guideInfo.fragmentComplete,
  ]);

  useLayoutEffect(() => {
    resetDeadlockState();
  }, [guideInfo.currentStep]);

  return isDeadlocked;
};

export default useProgressDeadlock;
