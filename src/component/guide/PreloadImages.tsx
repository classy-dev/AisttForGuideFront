import React from 'react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

// interface ToppingStep {
//   gt_image: string;
//   id: string; // or number, depending on your data structure
// }

const PreloadImages = () => {
  const toppingSteps = useSelector(
    (state: RootState) => state.guide.topping_steps
  );

  const preloadImages = useMemo(
    () =>
      toppingSteps
        .filter(toppingInfo => Boolean(toppingInfo.gt_image))
        .map(toppingInfo => ({
          src: toppingInfo.gt_image,
          crossOrigin: 'anonymous' as const,
        })),
    [toppingSteps] // guideInfo 전체 대신 topping_steps만 의존성으로 사용
  );

  return createPortal(
    <React.Fragment key="preload-image">
      {preloadImages.map(image => (
        <link
          key={image.src} // index 대신 이미지 URL을 key로 사용
          rel="prefetch"
          as="image"
          href={image.src}
          crossOrigin={image.crossOrigin}
        />
      ))}
    </React.Fragment>,
    document.head
  );
};

export default PreloadImages;
