const pick = <T extends Record<string, unknown>, K extends keyof T>(
  query: T,
  keys: K[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (query && Object.hasOwnProperty.call(query, key)) {
      finalObj[key] = query[key];
    }
  }

  return finalObj;
};

export default pick;
