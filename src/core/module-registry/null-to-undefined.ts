export const nullToUndefined = <T extends object>(patch: T) =>
  Object.fromEntries(
    Object.entries(patch).map(([key, value]) => [
      key,
      value === null ? undefined : value,
    ]),
  ) as { [K in keyof T]: Exclude<T[K], null> | undefined };
