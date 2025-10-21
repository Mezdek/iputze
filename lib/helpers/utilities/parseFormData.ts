//TODO try to replace with a react hook
export function parseFormData<T extends Record<string, any>>(
  form: HTMLFormElement,
  defaultValue: T
): T {
  const formData = new FormData(form);

  const result: T = structuredClone(defaultValue);

  for (const [k, value] of formData.entries()) {
    const key = k as keyof T;
    if (Array.isArray(result[key])) {
      (result[key] as unknown as any[]).push(value);
    } else {
      result[key] = value as T[typeof key];
    }
  }
  return result;
}
