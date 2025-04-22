import { useCallback, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { ToppingArea } from 'InterfaceFarm/menu';
import { calculateDoughRect, DoughRect } from 'UtilFarm/visual/image';

const GuideImageWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  canvas {
    visibility: hidden;
    opacity: 1;
    position: absolute;
  }
`;

interface Props {
  src: string;
  toppingArea: ToppingArea | null;
  onLoad?: (doughRect: DoughRect | null) => void;
}

const GuideImage = ({ src, toppingArea, onLoad }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(async () => {
    const img = imageRef.current;

    if (!img || !src) return;

    try {
      const rect = await calculateDoughRect(img, toppingArea ?? undefined);
      onLoad?.(rect);
    } catch (e) {
      console.error(e);
      onLoad?.(null);
    }
  }, [src, toppingArea, onLoad]);

  useLayoutEffect(() => {
    const img = imageRef.current;

    if (!img) return;

    img.onload = handleLoad;
    img.onerror = () => onLoad?.(null);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [handleLoad]);

  return (
    <GuideImageWrapper>
      <img ref={imageRef} src={src} crossOrigin="anonymous" />
    </GuideImageWrapper>
  );
};

export default GuideImage;
