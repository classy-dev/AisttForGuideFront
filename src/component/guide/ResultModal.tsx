import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import anime from 'animejs';
import Modal, { ModalProps, ModalSection } from 'Root/src/component/Modal';
import messageQueueSlice from 'SliceFarm/messageQueue';

interface Props extends ModalProps {
  menuName?: string;
}

import styled from '@emotion/styled';
import { Button } from 'ComponentFarm/Button';
import Result from 'ComponentFarm/icon/Result';

export const ResultModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 48.6rem;
  min-height: 37rem;
  text-align: center;
  background-color: #fff;
  border-radius: inherit;
  cursor: pointer;

  /* color: #ff4600; */
  /* .scoreboard__line {
    position: absolute;
    width: 90%;
    height: 90%;
    border: 2px solid #ff862c;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    opacity: 0.4;
    pointer-events: none;
    border-radius: 10px;
  } */
`;

const ResultModal = ({ menuName, ...modalProps }: Props) => {
  const dispatch = useDispatch();

  const scoreRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = React.useState(modalProps.show);
  const [score] = React.useState(70 + Math.floor(Math.random() * 30.99));

  useEffect(() => {
    const scoreEl = scoreRef.current;

    if (!entered) {
      return anime.remove(scoreEl);
    }

    anime({
      targets: scoreEl,
      delay: 500,
      duration: 1000,
      easing: 'linear',
      scale: [0.75, 1],
      update: () => scoreEl && (scoreEl.innerText = `${anime.random(10, 99)}`),
      complete: () => scoreEl && (scoreEl.innerText = `${score}`),
    });
  }, [entered]);

  useEffect(() => {
    if (modalProps.show)
      dispatch(
        messageQueueSlice.actions.push({
          type: 'alert',
          message: `제조가 완료되었습니다.`,
          beforeEffect: true,
          effectType: 'complete',
        })
      );
  }, [modalProps.show]);

  return (
    <Modal
      {...modalProps}
      onEntered={() => setEntered(true)}
      onExit={() => setEntered(false)}
    >
      <ResultModalWrapper>
        <Result className="mb-[2.4rem]" />
        <ModalSection>
          <h3>제조가 완료되었습니다!</h3>
          <p>아래의 버튼을 누르면 메뉴선택으로 돌아갑니다.</p>
          <Button
            variant="outline"
            className="!mt-[3.6rem]"
            onClick={modalProps.onClose}
          >
            메뉴로 돌아가기
          </Button>
        </ModalSection>
      </ResultModalWrapper>
    </Modal>
  );
};

export default ResultModal;
