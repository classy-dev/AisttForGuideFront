import React from 'react';
import styled from '@emotion/styled';

interface DetectionScreenProps {
  direction: 'LEFT' | 'RIGHT' | 'NONE';
  frame: string;
}

const DetectionScreenStyle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);

  .msg-box {
    width: 100%;
    font-weight: bold;
    overflow: hidden;
  }

  .detection-image-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2.4rem 0;
    img {
      height: 100%;
    }
  }
`;

const DetectionScreen = ({ direction, frame }: DetectionScreenProps) => {
  return (
    <DetectionScreenStyle className=" flex flex-col items-center shadow-md rounded-md bg-typo-7/50">
      <div className="relative flex flex-1 w-full gap-2">
        <div className="detection-image-wrapper">
          <img
            src={frame}
            className="w-auto object-contain"
            alt="Guide Image"
          />
        </div>
      </div>
    </DetectionScreenStyle>
  );
};

export default DetectionScreen;
