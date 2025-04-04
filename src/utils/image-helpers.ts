
/**
 * Ensures the input value is a string, handling various input types
 * Useful for form fields that might receive string or array values
 */
export function ensureImageString(value: string | string[] | null | undefined): string {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : '';
  }
  return value;
}

/**
 * Ensures the input value is a string array, handling various input types
 * Useful for form fields that might receive string or array values
 */
export function ensureImageArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}
