import { StrapiMedia, StrapiSingleData } from './strapi';

export interface IIngredient {
  ingredient_name: string;
  ingredient_image: StrapiSingleData<StrapiMedia>;
  ingredient_unit: string | null;
}

export type ToppingArea = 'half_left' | 'half_right' | 'dough_inner';

export type PositionInfo = {
  type: string;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  positions: [x: number, y: number, r?: number][];
};

export interface IMenu {
  ai_menu_code: string; // 관리버전 연동 제품 idx
  menu_name: string;
  menu_image: StrapiSingleData<StrapiMedia>;
  use_guide: boolean;
  topping_steps: {
    id: number;
    ai_step_code: string; // 관리버전 연동 단계별 코드
    topping_area: ToppingArea | null;
    ingredient_idx: number;
    initial_value: number | null;
    required_value: number;
    fragment_required_value: number | null;
    gt_image: string;
    task: string;
    is_after_topping: boolean;
    quantity: number;
    details?: string;
    topping_group_value?: string;
    ingredient?: StrapiSingleData<IIngredient>;
    alerts?: {
      [key: string]: string | number | undefined;
      id: number;
      start: string;
      wrong_topping_order?: string; // 토핑 순서 미준수
      no_toppings?: string; // 토핑 미진행
      lack_amount?: string; // 개수/면적 부족
    };
    detection_info?: PositionInfo | null; // JSON Format
  }[];
}

export interface IMenuListItem
  extends Pick<
    IMenu,
    'use_guide' | 'ai_menu_code' | 'menu_name' | 'menu_image'
  > {}

export type MenuJsonData = {
  menu: IMenu[];
  side: IMenu[];
  recipe_ingredients: IIngredient[];
};
