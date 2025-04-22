import React, { useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';
import styled from '@emotion/styled';

export interface ModalProps {
  show?: boolean;
  contentClassName?: string;
  fullScreen?: boolean;
  onClose: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
}

const duration = 350;

const ModalContent = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;

  ${props => `
    width: ${props.fullScreen ? '100%' : 'auto'};
    height: ${props.fullScreen ? '100%' : 'auto'};
    border-radius: ${props.fullScreen ? '0' : '0.8rem'};
  `}
`;

export const ModalSection = styled.section`
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h3 {
    font-size: 3.2rem;
    margin-bottom: 1.6rem;
    font-weight: 700;
  }

  p {
    font-size: 2rem;
    margin: 0;
  }

  button {
    margin-top: 1.6rem;
  }
`;

const Modal = ({
  show,
  children,
  contentClassName,
  fullScreen,
  onClose,
  onExit,
  onExited,
  onEnter,
  onEntered,
}: React.PropsWithChildren<ModalProps>) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const traslateStyles = useCallback(
    (state: TransitionStatus) => ({
      transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
      transform:
        state === 'entering' || state === 'entered'
          ? 'translateY(0)'
          : fullScreen
            ? 'translateY(0)'
            : 'translateY(15%)',
      opacity: state === 'entering' || state === 'entered' ? 1 : 0,
    }),
    [fullScreen]
  );

  const opaictyStyle = useCallback(
    (state: TransitionStatus) => ({
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: state === 'entering' || state === 'entered' ? 1 : 0,
    }),
    []
  );

  return ReactDOM.createPortal(
    <Transition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={show}
      duration={duration}
      timeout={duration}
      onExit={onExit}
      onExited={onExited}
      onEnter={onEnter}
      onEntered={onEntered}
    >
      {state => (
        <div
          ref={nodeRef}
          className="fixed z-30 left-0 top-0 w-full h-[calc(100%_-_5.4rem)] flex justify-center items-center mt-[5.4rem]"
        >
          <ModalContent
            fullScreen={!!fullScreen}
            className={`max-w-full max-h-full left-0 top-0 z-20 ${
              fullScreen && 'w-full h-full'
            } ${contentClassName}`}
            style={traslateStyles(state)}
          >
            {children}
          </ModalContent>
          <div
            aria-label="close modal dim"
            tabIndex={0}
            role="button"
            className="z-10 fixed left-0 top-0 w-full h-full bg-black/25"
            style={opaictyStyle(state)}
            onClick={onClose}
            onKeyDown={e => e.key && onClose()}
          />
        </div>
      )}
    </Transition>,
    document.body
  );
};

export default Modal;
