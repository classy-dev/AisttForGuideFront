import { useEffect, useLayoutEffect, useRef } from 'react';
import guideSlice from 'SliceFarm/guide';
import messageQueueSlice from 'SliceFarm/messageQueue';
import { useAppDispatch } from 'StoreFarm/index';

interface useGuideEffectsProps {
  onReset: () => void;
}

const useGuideEffects = ({ onReset }: useGuideEffectsProps) => {
  const dispatch = useAppDispatch();
  const resetRef = useRef<typeof onReset>(onReset);

  useLayoutEffect(() => {
    resetRef.current = onReset;
  }, [onReset]);

  useEffect(() => {
    const handleReset = () => {
      dispatch(messageQueueSlice.actions.reset());
      console.log('onReset');
      resetRef.current();
    };

    window.addEventListener('beforeunload', handleReset);

    return () => {
      window.removeEventListener('beforeunload', handleReset);
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(guideSlice.actions.initialize());
      resetRef.current();
    };
  }, [dispatch]);
};

export default useGuideEffects;
