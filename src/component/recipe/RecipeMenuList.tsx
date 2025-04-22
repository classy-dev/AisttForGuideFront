import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import userSlice from 'SliceFarm/user';
import styled from '@emotion/styled';
import { useFetchMenuList } from 'HookFarm/useMenu';

const MenuListStyle = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;

  max-width: 43rem;
  width: 100%;
  border-right: 2px solid #e5e5e5;
  max-height: 100%;
  overflow-y: auto;
`;

const RecipeMenuList = () => {
  const dispatch = useDispatch();
  const { direction } = useParams<{ direction: string }>();
  const { data } = useFetchMenuList({
    'populate[menu_image][populate]': '*', // 메뉴 이미지 정보도 함께 가져옴
  });

  const menuList = React.useMemo(() => data?.data ?? [], [data]);

  const handleActiveToClasses = React.useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `h-[8.34rem] flex items-center justify-center w-full text-1xl font-bold cursor-pointer  ${
        isActive ? 'bg-[#B2DDFF] text-[#2264E5]' : ''
      }`,
    []
  );

  return (
    <MenuListStyle>
      <h3 className="flex-none flex items-center justify-center text-[#2264E5] bg-[#EEF4FF] text-lg font-bold p-1 text-center h-[7.4rem] border-b-2 border-b-[#E5E5E5] ">
        메인 메뉴 선택
        <span className="text-[#b2ddff] text-sm pl-[0.8rem]">
          Main menu Select
        </span>
      </h3>
      <ul className="flex w-full flex-wrap bg-white">
        {menuList.map(menu => (
          <li
            key={menu.id}
            className="flex w-1/2 odd:border-r border-b border-[#E5E5E5]"
          >
            <NavLink
              to={`/${direction}/${menu.id}`}
              className={handleActiveToClasses}
              onClick={() =>
                dispatch(userSlice.actions.setLatestSelectedMenuIdx(menu.id))
              }
            >
              {menu.attributes.menu_name}
            </NavLink>
          </li>
        ))}
      </ul>
    </MenuListStyle>
  );
};

export default RecipeMenuList;
