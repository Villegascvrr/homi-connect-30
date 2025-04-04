
/**
 * Helper function to ensure we get a string from an image value
 * This is useful when handling form values that could be string or string[]
 */
export function ensureImageString(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : '';
  }
  return value;
}

/**
 * Helper function to ensure we get a string array from an image value
 * This is useful when handling form values that could be string or string[]
 */
export function ensureImageArray(value: string | string[]): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}
