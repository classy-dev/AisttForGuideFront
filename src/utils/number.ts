export const toNumberOrOtherValue = (
  str: string | string[] | undefined,
  defaultValue?: number
) => {
  const int = parseInt(String(str) ?? '', 10);

  return defaultValue === undefined
    ? null
    : Number.isNaN(int) && typeof defaultValue !== 'undefined'
      ? defaultValue
      : int;
};

export const toNumber = (str: string | null | undefined) => {
  const int = parseInt(str ?? '', 10);
  return Number.isNaN(int) ? undefined : int;
};

export const setComma = (value: string | number) =>
  Math.ceil(Number(toNumber(String(value))))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
