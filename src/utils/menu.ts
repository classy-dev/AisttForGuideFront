import { IMenu } from 'InterfaceFarm/menu';

const findGroups = (
  toppingSteps: IMenu['topping_steps'],
  startIndex: number
) => {
  const groups = [];

  while (
    toppingSteps[startIndex + 1]?.task === 'pass' &&
    toppingSteps[startIndex + 1]?.is_after_topping === false
  ) {
    groups.push(toppingSteps[startIndex + 1]);
    startIndex++;
  }

  return groups;
};

export const mergeGroupTopping = (
  toppingSteps: IMenu['topping_steps']
): IMenu['topping_steps'] => {
  return toppingSteps.map((step, index) => {
    const groups = findGroups(toppingSteps, index);

    if (groups.length === 0) return step;
    else {
      const attrs = step.ingredient?.data?.attributes;

      const copyAttrs = {
        ...attrs,
        ingredient_name: `${step.ingredient?.data.attributes
          .ingredient_name} & ${groups
          .map(group => group.ingredient?.data.attributes.ingredient_name)
          .join(' & ')}`,
      };

      return {
        ...step,
        ingredient: {
          ...step.ingredient,
          data: { attributes: copyAttrs },
        },
      } as IMenu['topping_steps'][number];
    }
  });
};
