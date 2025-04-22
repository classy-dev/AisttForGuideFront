import axios from 'axios';
import { IMenu } from 'InterfaceFarm/menu';
import { StrapiSingleData, StrapiMultipleData } from 'InterfaceFarm/strapi';

const strapiApi = axios.create({
  baseURL: import.meta.env.VITE_GUIDE_API_URL,
  headers: {
    Authorization: 'Bearer ' + import.meta.env.VITE_GUIDE_API_TOKEN,
  },
});

export const fetchMenu = async (menu_idx: number) => {
  const res = await strapiApi.get<StrapiSingleData<IMenu>>(
    `/api/guide-menus/${menu_idx}`,
    {
      params: {
        'populate[topping_steps][populate]': '*',
        'populate[menu_image][populate]': '*',
      },
    }
  );

  return res.data.data ?? null;
};

export const fetchMenuList = async (
  params: Record<string, string> | undefined = {
    'populate[menu_image][populate]': '*',
  }
) => {
  const res = await strapiApi.get<StrapiMultipleData<IMenu>>(
    '/api/guide-menus',
    {
      params,
    }
  );

  return res.data ?? null;
};
