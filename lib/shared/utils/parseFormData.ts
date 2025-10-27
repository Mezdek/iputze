//TODO try to replace with a react hook
export function parseFormData<T extends object>(
  form: HTMLFormElement,
  defaultValue: T
): T {
  const formData = new FormData(form);

  const result: T = structuredClone(defaultValue);

  for (const [k, value] of formData.entries()) {
    const key = k as keyof T;
    if (key in result) {
      if (Array.isArray(result[key])) {
        const currentArray = result[key] as unknown[];
        (result[key] as unknown) = [...currentArray, value];
      } else {
        result[key] = value as T[typeof key];
      }
    }
  }
  return result;
}
