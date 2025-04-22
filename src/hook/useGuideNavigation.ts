import { useMemo } from 'react';
import { GuideDirection } from 'HookFarm/useAisttSocketEvents';

const useGuideNavigation = (menuId?: string, direction?: string) => {
  const menuIdNumber = useMemo(() => parseInt(menuId ?? '', 10), [menuId]);
  const directionValue = useMemo(
    () =>
      GuideDirection[(direction?.toUpperCase() as 'LEFT' | 'RIGHT') ?? 'NONE'],
    [direction]
  );
  const isValidRoute = useMemo(
    () => !Number.isNaN(menuIdNumber),
    [menuIdNumber]
  );

  return {
    menuIdNumber,
    directionValue,
    isValidRoute,
  };
};

export default useGuideNavigation;
