export function filterDefinedProps<T extends Record<string, unknown>>(
  props: T
): Partial<T> {
  const entries = Object.entries(props);
  const definedEntries = entries.filter(([_key, value]) => value !== undefined);
  return Object.fromEntries(definedEntries) as Partial<T>;
}
