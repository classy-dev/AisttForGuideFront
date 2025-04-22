import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeInOutShake = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(0);
  }
  
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  15% {
    transform: translateY(20px);
  }

  20% { 
    transform: translateY(0);
    opacity: 1;
  }

  30% { 
    transform: translateY(0);
    opacity: 1;
  }

  40% { 
    transform: translateY(0);
    opacity: 0;
  }

  50% { 
    transform: translateY(0);
    opacity: 0;
  }

  


  70% { 
    opacity: 0; 
    transform: translateY(0);
  }
  
  100% {
    opacity: 0;
    transform: translateY(0);
  }
`;

const DrizzleWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const PowderContainer = styled.div<{ x: number; y: number; delay: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: 0px;
  transform-origin: center center;
  animation: ${fadeInOutShake} 6s ${props => props.delay}s infinite;
  opacity: 0;
  width: 250px;
  height: 250px;
`;

const SVGWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  left: number;
  top: number;
  width: number;
  height: number;
}

const PowderAnimation = ({ left, top, width, height }: Props) => {
  const points = [
    { x: width * 0.08, y: height / 2 },
    { x: width * 0.4, y: height / 2 },
    { x: width * 0.7, y: height / 2 },
  ];

  const getDelay = (index: number) => index * 2;

  return (
    <DrizzleWrapper style={{ left, top, width, height }}>
      {points.map((point, index) => (
        <PowderContainer
          key={index}
          x={point.x}
          y={point.y}
          delay={getDelay(index)}
        >
          <SVGWrapper>
            <svg width="100%" height="100%" viewBox="268 25 244 460">
              <g transform="translate(390 255)">
                <g transform="scale(0.9) rotate(210) translate(-390 -255)">
                  {/* <!-- 상단 노란색 부분 --> */}
                  <path
                    fill="#FFD700"
                    d="M292.567 113.337c-7.649 0-13.849-6.259-13.849-13.977V61.626c0-19.263 15.529-34.937 34.621-34.937h153.712c19.09 0 34.618 15.673 34.618 34.937v37.735c0 7.718-6.198 13.977-13.846 13.977H292.567z"
                  />

                  {/* <!-- 목 부분 --> */}
                  <path
                    fill="#FFF5CC"
                    d="M482.067 130.453c0 12.405-9.953 22.464-22.227 22.464H320.549c-12.275 0-22.225-10.059-22.225-22.464v-5.992c0-12.406 9.95-22.466 22.225-22.466H459.84c12.274 0 22.227 10.06 22.227 22.466v5.992z"
                  />

                  {/* <!-- 본체 부분 --> */}
                  <path
                    fill="#FFEFBA"
                    d="M512 462.228c0 12.748-10.224 23.083-22.837 23.083H291.228c-12.614 0-22.838-10.336-22.838-23.083V169.832c0-12.75 10.223-23.084 22.838-23.084h197.935c12.613 0 22.837 10.335 22.837 23.084v292.396z"
                  />
                  <path
                    opacity="0.1"
                    d="M313.129 462.228V169.832c0-12.75 10.224-23.084 22.838-23.084h-44.738c-12.614 0-22.838 10.335-22.838 23.084v292.396c0 12.748 10.223 23.083 22.838 23.083h44.738c-12.614 0-22.838-10.336-22.838-23.083z"
                  />

                  {/* <!-- 상단 버튼 --> */}
                  <path
                    fill="#FFB700"
                    d="M400.293 67.305h-20.197c-4.465 0-8.084-3.62-8.084-8.084 0-4.464 3.62-8.084 8.084-8.084h20.197c4.465 0 8.083 3.62 8.083 8.084 0 4.464-3.618 8.084-8.083 8.084z"
                  />

                  {/* <!-- 상단 별 장식 --> */}
                  <path
                    fill="#FFF5CC"
                    d="M444.337 185.595c14.288 5.917 19.086 10.715 25.003 25.003 5.917-14.287 10.715-19.086 25.004-25.003-14.289-5.919-19.087-10.716-25.004-25.004-5.917 14.283-10.715 19.081-25.003 25.001z"
                  />
                  <circle fill="#FFF5CC" cx="485.292" cy="225.928" r="11.031" />
                </g>
              </g>
            </svg>
          </SVGWrapper>
        </PowderContainer>
      ))}
    </DrizzleWrapper>
  );
};

export default PowderAnimation;
