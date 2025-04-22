import styled from '@emotion/styled';

export const GuideWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.4rem;

  .guide-content {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 2px solid #e5e5e5;
    border-radius: 0.8rem;
    background-color: #fff;
  }
`;

export const ProgressWrap = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;

  // Basic styling and centering
  .progress_wrapper {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 0.8rem;
    border: 2px solid #e5e5e5;
    user-select: none; // disable user selection, for better drag & drop
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      width: 2rem;
      height: 100%;
      bottom: 0;
      left: 0;
      opacity: 1;
      background-image: repeating-linear-gradient(
        transparent,
        transparent 3.8rem,
        #d9d9d9 3.9rem,
        #d9d9d9 4rem,
        #d9d9d9 4.1rem,
        transparent 4.2rem
      );
    }
  }

  .range__input {
    display: none;
  }

  // Position the SVG root element
  .range__slider {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    background: #b2ddff;
    z-index: 2;
    overflow: hidden;
    transition: all 350ms linear;
  }

  .range__bg-pattern {
    position: absolute;
    width: 2rem;
    bottom: 0;
    left: 0;
    opacity: 1;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 3.8rem,
      #fff 3.9rem,
      #fff 4rem,
      #fff 4.1rem,
      transparent 4.2rem
    );
    z-index: 1;
  }

  // Slider color
  /* .range__slider__path {
    fill: #bdbdbd;
  } */

  // Positioning the container for values, it will be translated with Javascript
  .range__values {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    transition: all 350ms linear;
    display: flex;
    align-items: center;
  }

  // Basic styles for the values
  .range__value {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 1.5rem 2.5rem 1.5rem;
    position: absolute;
    align-items: baseline;
    justify-content: center;
    top: 50%;
    left: 0;
    font-weight: 600;
    transform: translateY(-50%);
  }

  .range__value__number {
    font-size: 3.7rem;
    display: inline-flex;
    align-items: baseline;
    letter-spacing: -0.02em;

    &:first-of-type {
      margin-left: 0.8rem;
    }

    &:last-of-type {
      margin-right: 0.8rem;
    }
  }

  .range__value__number-unit {
    padding-left: 0.25rem;
  }
  .range__value__unit {
    padding-left: 0.25rem;
  }
  .range__value__number-unit,
  .range__value__unit {
    font-size: 2.4rem;
  }

  // These transform-origin values will keep the numbers in the right position as they are scaled
  // .range__value__number--top {
  //   transform-origin: 100% 100%; // bottom-right corner
  // }
  // .range__value__number--bottom {
  //   transform-origin: 100% 0; // top-right corner
  // }

  /* .range__value__text {
    display: flex;
    flex-direction: column;
    text-transform: uppercase;

    span:first-child {
      margin-bottom: 3px;
    }
  } */

  .range__value__text--top {
    align-self: flex-end;
    margin-bottom: 13px;
  }

  .range__value__text--bottom {
    margin-top: 10px;
  }
`;
