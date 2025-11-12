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

export function parseFormData_alt<T extends Record<string, unknown>>(
  form: HTMLFormElement
): T {
  const formData = new FormData(form);
  const result = {} as Record<string, unknown>;

  for (const [key, value] of formData.entries()) {
    if (result[key] !== undefined) {
      result[key] = Array.isArray(result[key])
        ? [...(result[key] as unknown[]), value]
        : [result[key], value];
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
