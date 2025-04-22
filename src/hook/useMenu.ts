import { useQuery, UseQueryOptions } from 'react-query';
import { fetchMenuList, fetchMenu } from 'ApiFarm/menu';
import { IMenu } from 'InterfaceFarm/menu';
import { StrapiEntry } from 'InterfaceFarm/strapi';

export const useFetchMenu = (
  menu_idx: number,
  queryOptions?: Omit<
    UseQueryOptions<StrapiEntry<IMenu> | null>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryData = useQuery(
    ['menu-list', menu_idx],
    () => fetchMenu(menu_idx),
    queryOptions
  );

  return queryData;
};

export const useFetchMenuList = (params?: Record<string, string>) => {
  const queryData = useQuery(['menu-list', params], () =>
    fetchMenuList(params)
  );

  return queryData;
};
