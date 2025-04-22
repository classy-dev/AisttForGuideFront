import React from 'react';
import Modal, { ModalProps, ModalSection } from 'Root/src/component/Modal';
import styled from '@emotion/styled';
import Dough from 'ComponentFarm/icon/Dough';
import Toppingtable from 'ComponentFarm/icon/Toppingtable';
import { FadeSlideIn } from 'UtilFarm/animations';

export const DoughStepWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f6f6f6;
  padding: 2.4rem;
  border-radius: 0.8rem;
  min-height: 36.9rem;

  .dough-animation {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 4.2rem;
    margin-bottom: 1.6rem;

    .dough {
      position: absolute;
      top: 0.4rem;
      transform: translateY(10rem);
      animation: ${FadeSlideIn} 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    }
  }
`;

const DoughStepModal = ({ ...props }: ModalProps) => {
  return (
    <Modal {...props}>
      <DoughStepWrapper>
        <div className="dough-animation">
          <Toppingtable className="topping-table" />
          <Dough className="dough" />
        </div>
        <ModalSection>
          <h3>테이블 위에 도우를 올려주세요</h3>
          <p>해당 테이블 위에 도우를 올리면 시작됩니다.</p>
        </ModalSection>
      </DoughStepWrapper>
    </Modal>
  );
};

export default DoughStepModal;
