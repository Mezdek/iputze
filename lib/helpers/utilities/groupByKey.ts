export const groupByKey = <T, K extends keyof T>(params: {
  items: T[];
  key: K;
}): T[][] => {
  const { items, key } = params;

  const grouped = items.reduce<Record<string | number, T[]>>(
    (acc, item) => {
      const newKey = (item[key] as string | number) || 0;
      if (!acc[newKey]) {
        acc[newKey] = [];
      }
      acc[newKey].push(item);
      return acc;
    },
    {} as Record<string | number, T[]>
  );

  return Object.values(grouped);
};
