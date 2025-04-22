import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

const useGuideState = () => {
  const guideInfo = useSelector((state: RootState) => state.guide);
  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );
  const fragmentComplete = useSelector(
    (state: RootState) => state.guide.fragmentComplete
  );

  return {
    guideInfo,
    isDev,
    fragmentComplete,
  };
};

export default useGuideState;
