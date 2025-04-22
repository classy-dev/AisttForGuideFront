import React, { useRef, useCallback, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Transition, TransitionStatus } from 'react-transition-group';

interface AppSidebarProps {
  show?: boolean;
  onClose: () => void;
}

const duration = 350;

const AppSidebar = ({ show, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  const translateStyles = useCallback(
    (state: TransitionStatus) => ({
      transition: `transform ${duration}ms ease-in-out`,
      transform:
        state === 'entering' || state === 'entered'
          ? 'translateX(0)'
          : 'translateX(-100%)',
    }),
    []
  );

  const opaictyStyle = useCallback(
    (state: TransitionStatus) => ({
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: state === 'entering' || state === 'entered' ? 1 : 0,
    }),
    []
  );

  useEffect(() => {
    if (show) {
      onClose();
    }
  }, [location.pathname]);

  const handleActiveToClasses = React.useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `-mx-5 px-6 py-2 block ${isActive && 'bg-typo-5 font-bold'}`,
    []
  );

  return (
    <Transition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={show}
      duration={duration}
      timeout={duration}
    >
      {state => (
        <div ref={nodeRef} className="fixed">
          <div
            className="fixed w-[300px] h-full left-0 top-0 bg-typo-7 z-20 shadow-sidebar"
            style={translateStyles(state)}
          >
            <button
              onClick={onClose}
              className="absolute w-16 h-16 inline-flex items-center justify-center top-0 right-0"
            >
              <img src="/img/close.png" className="w-8 h-8" />
            </button>
            <div className="flex flex-col p-5 w-full h-full overflow-y-auto divide-y divide-typo-4">
              <section className="flex pb-3">
                <h2 className="font-bold text-2xl">광화문 글로벌 본사점</h2>
              </section>
              <ul className="flex flex-col pt-2 text-typo-2 font-medium">
                <li className="text-xl">
                  <NavLink to="/recipes" className={handleActiveToClasses}>
                    레시피
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="z-10 fixed left-0 top-0 w-full h-full bg-black/25"
            style={opaictyStyle(state)}
            onClick={onClose}
          />
        </div>
      )}
    </Transition>
  );
};

export default AppSidebar;
