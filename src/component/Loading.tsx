import styled from '@emotion/styled';
import { RippleLoadingKeyFrames } from 'UtilFarm/animations';

const RippleLoadingStyle = styled.div`
  display: inline-flex;
  position: relative;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    border: 0.4rem solid currentColor;
    transform-origin: 0 0;
    opacity: 1;
    border-radius: 50%;
    animation: ${RippleLoadingKeyFrames} 1s cubic-bezier(0, 0.2, 0.8, 1)
      infinite;
  }

  div:nth-of-type(2) {
    animation-delay: -0.5s;
  }
`;

const Loading = ({ className }: { className?: string }) => (
  <RippleLoadingStyle className={className}>
    <div />
    <div />
  </RippleLoadingStyle>
);

export default Loading;
