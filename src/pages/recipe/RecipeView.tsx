import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RecipeToppingSteps from 'Root/src/component/recipe/RecipeToppingSteps';
import { RootState } from 'StoreFarm/reducer';
import { Button } from 'ComponentFarm/Button';
import StrapiImage from 'ComponentFarm/strapi/Image';
import { useFetchMenu } from 'HookFarm/useMenu';
import { getAudioContext } from 'UtilFarm/sound/audio';

const RecipeView = () => {
  const navigate = useNavigate();
  const { menuId, direction } = useParams<{
    menuId: string;
    direction: string;
  }>();

  const isConnected = useSelector(
    (state: RootState) => state.connected.isConnected
  );

  const menuIdNumber = React.useMemo(
    () => parseInt(menuId ?? '', 10),
    [menuId]
  );

  const { data: menu, isLoading } = useFetchMenu(menuIdNumber, {
    onError: () =>
      navigate(`/${direction}`, {
        replace: true,
      }),
  });

  // type safe
  const menuAttrs = menu?.attributes ?? null;

  if (!menuAttrs || isLoading) {
    return (
      <div className="relative w-full h-full flex flex-col gap-y-[1.6rem] pl-[1.6rem] pr-[2.4rem] pt-[2.4rem]">
        <div className="flex-1 w-full h-full flex flex-col bg-white rounded-2xl border-[2px] border-[#E5E5E5] overflow-hidden box-border" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-y-[1.6rem] pl-[1.6rem] pr-[2.4rem] pt-[2.4rem]">
      <div className="flex-1 w-full h-full flex flex-col bg-white rounded-2xl border-[2px] border-[#E5E5E5] overflow-hidden box-border">
        <div className="flex-none flex items-center p-[2.4rem] gap-x-[1.2rem] border-b-[2px] border-[#E5E5E5]">
          <ul className="inline-flex">
            <li className="px-[0.8rem] py-[0.4rem] leading-none text-xs rounded-full border text-[#FF4600] bg-[#FFF1EA] border-currentColor">
              메인메뉴
            </li>
          </ul>
          <h3 className="font-bold text-3xl leading-tight">
            {menuAttrs.menu_name}
          </h3>
        </div>
        <div className="flex-1 flex p-[1.6rem] gap-x-[1.6rem]">
          <section className="flex-1 w-1/2 flex flex-col">
            <h3 className="mb-[1.6rem] font-bold">제품 완성본</h3>
            <div className="flex justify-center w-full h-full p-6 bg-[#EBEBEB] rounded-[0.8rem]">
              <StrapiImage
                image={menuAttrs?.menu_image.data.attributes}
                className="w-full object-contain max-w-6xl"
              />
            </div>
          </section>
          <section className="flex-1 w-1/2 flex flex-col overflow-auto">
            <h3 className="mb-[1.6rem] font-bold">레시피 정보</h3>
            <RecipeToppingSteps steps={menuAttrs?.topping_steps} />
          </section>
        </div>
      </div>
      <Button
        disabled={!isConnected || !menuAttrs.use_guide}
        className="!font-bold"
        onClick={() =>
          getAudioContext()
            .resume()
            .finally(() => navigate(`/${direction}/guide/${menu?.id ?? -1}`))
        }
      >
        {!isConnected
          ? 'AI 가이드를 시작하려면 서버 연결이 필요합니다.'
          : menu?.attributes.use_guide
            ? 'AI 가이드 시작하기'
            : 'AI 가이드를 지원하지 않는 메뉴입니다.'}
      </Button>
    </div>
  );
};

export default RecipeView;
