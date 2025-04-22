import { keyframes } from '@emotion/react';

export const Fade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const HalfFade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
`;

export const HalfFadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
`;

export const FadeSlideIn = keyframes`
from {
  opacity: 0;
  transform: translateY(10rem);
}

to {
  opacity: 1;
  transform: translateY(0);
}
`;

export const RotateLoadingKeyFrames = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
export const RippleLoadingKeyFrames = keyframes`
    0% {
      transform: translate(50%, 50%) scale(0);
      opacity: 0;
    }
    
    4.9% {
      transform: translate(50%, 50%) scale(0);
      opacity: 0;
    }

    5% {
      transform: translate(50%, 50%) scale(0);
      opacity: 1;
    }

    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
`;
