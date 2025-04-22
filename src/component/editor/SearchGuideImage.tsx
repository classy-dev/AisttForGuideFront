import React from 'react';
import styled from '@emotion/styled';
import { useFetchMenuList } from 'HookFarm/useMenu';

const SearchGuideImageStyle = styled.div`
  &.disabled {
    opacity: 0.5;

    li {
      cursor: not-allowed;
    }
  }

  ul {
    display: flex;
    max-width: 1024px;
    overflow-x: auto;
  }

  li {
    flex: none;
    width: 220px;
    text-align: center;
    cursor: pointer;

    p {
      font-weight: bold;
    }
  }
`;

const SearchGuideImage = ({
  disabled,
  onClickImage,
}: {
  disabled?: boolean;
  onClickImage: (src: string) => void;
}) => {
  const { data } = useFetchMenuList({
    'populate[topping_steps][populate]': '*',
  });

  const list = data?.data ?? [];

  return (
    <SearchGuideImageStyle className={disabled ? 'disabled' : ''}>
      <ul>
        {list.map(menu =>
          menu.attributes.topping_steps.map(
            step =>
              step.task === 'detection' &&
              step.id !== 1 && (
                <li
                  key={`${menu.id}_${step.id}`}
                  onClick={() => !disabled && onClickImage?.(step.gt_image)}
                >
                  <img
                    src={step.gt_image}
                    alt={`${step.id ?? ''}`}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                  <span>{`${menu.attributes.menu_name}`}</span>
                </li>
              )
          )
        )}
      </ul>
    </SearchGuideImageStyle>
  );
};

export default SearchGuideImage;
