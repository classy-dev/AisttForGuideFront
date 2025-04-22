import React from 'react';
import Modal, { ModalSection } from 'Root/src/component/Modal';

interface Props {
  show: boolean;
  onBack: () => void;
}

const UsedNotificationModal = ({ show, onBack }: Props) => {
  return (
    <Modal show={show} fullScreen onClose={() => {}}>
      <ModalSection>
        <h3>현재 토핑테이블은 다른 화면에서 사용중입니다.</h3>
        <p>잠시 후 이용해 주세요.</p>
        <button
          type="button"
          onClick={onBack}
          className="flex max-w-xs items-center justify-center w-full text-3xl bg-[#2264E5] h-[6rem] rounded-[0.6rem] transition-colors text-white font-medium disabled:bg-typo-5 disabled:text-typo-4 disabled:cursor-not-allowed"
        >
          뒤로가기
        </button>
      </ModalSection>
    </Modal>
  );
};

export default UsedNotificationModal;
