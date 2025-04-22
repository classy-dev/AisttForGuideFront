import { useMemo } from 'react';
import styled from '@emotion/styled';
import { segmentWLineToPath } from 'UtilFarm/visual/segmentPreset';

const DrizzleWrapper = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

interface Props {
  left: number;
  top: number;
  width: number;
  height: number;
}

const DrizzleAnimation = ({ left, top, width, height }: Props) => {
  const path = useMemo(
    () => segmentWLineToPath(width, height),
    [width, height]
  );
  return (
    <DrizzleWrapper
      style={{
        left,
        top,
        width,
        height,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 740 480">
        <path id="motionPath" className="path" fill="transparent" d={path} />
        <g id="bottle">
          {/* 페이드 인/아웃 애니메이션 */}
          <animate
            attributeName="opacity"
            values="0;0;1;1;0"
            keyTimes="0;0.1;0.2;0.9;1"
            dur="7s"
            begin="2s"
            repeatCount="indefinite"
          />

          {/* 새로운 소스통 디자인 */}
          <g
            transform="scale(0.6) rotate(210 100 50) translate(50 50)"
            rotate={'180'}
          >
            <polygon
              style={{ fill: '#FFF5E1' }}
              points="147.974,0 114.215,0 97.336,90.022 131.095,123.78 164.853,90.022"
            />
            <polygon
              style={{ fill: '#FFF5E1' }}
              points="159.226,90.022 136.721,168.791 192.985,168.791 192.985,90.022"
            />
            <rect
              x="68.079"
              y="90.022"
              width="92.273"
              height="78.769"
              style={{ fill: '#FFE5B4' }}
            />
            <path
              style={{ fill: '#FFF8DC' }}
              d="M205.363,180.044c0-18.567-15.191-33.758-33.758-33.758H56.826
   c-18.567,0-33.758,15.191-33.758,33.758v298.198c0,18.567,15.191,33.758,33.758,33.758h114.778
   c18.567,0,33.758-15.191,33.758-33.758l-22.505-149.099L205.363,180.044z"
            />
            <path
              style={{ fill: '#FFE4C4' }}
              d="M205.363,146.286h-33.758c18.567,0,33.758,15.191,33.758,33.758v298.198
   c0,18.567-15.191,33.758-33.758,33.758h33.758c18.567,0,33.758-15.191,33.758-33.758V180.044
   C239.121,161.477,223.93,146.286,205.363,146.286z"
            />
            <polygon
              style={{ fill: '#FFEFD5' }}
              points="137.846,246.041 171.604,478.242 205.363,478.242 205.363,270.066"
            />
            <rect
              x="56.826"
              y="270.066"
              style={{ fill: '#FFE4B5' }}
              width="114.778"
              height="208.176"
            />
            <path
              style={{ fill: '#FFEFD5' }}
              d="M171.604,180.044l-33.758,49.878l33.758,49.878c8.428-4.917,17.509-9.452,33.758-9.734v-90.022
   H171.604z"
            />
            <path
              style={{ fill: '#FFE4C4' }}
              d="M56.826,180.044v90.022c36.29,0.653,36.864,22.483,74.257,22.483
   c20.683,0,30.101-6.673,40.521-12.749v-99.756H56.826z"
            />
          </g>
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            begin={`2s`}
            keyPoints="0;0;0.25;0.5;0.75;1"
            keyTimes="0;0.1;0.325;0.55;0.775;1"
            calcMode="linear"
          >
            <mpath href="#motionPath" />
          </animateMotion>
        </g>
      </svg>
    </DrizzleWrapper>
  );
};

export default DrizzleAnimation;
