/**
 * Converts text strings to uppercase while ignoring IDs, dates, URLs, and file paths.
 */
export function toUpper<T>(val: T): T {
  if (typeof val === 'string') {
    // Keep URLs, base64 images, and ISO dates unchanged if needed, but uppercase all text
    if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/') || val.startsWith('/uploads/')) {
      return val as T;
    }
    return val.toUpperCase() as T;
  }
  return val;
}

export function sanitizeUppercasePayload<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  const result: Record<string, any> = {};

  const skipKeys = new Set(['id', 'createdAt', 'updatedAt', 'fecha', 'date', 'imageUrl', 'logoUrl', 'url', 'image', 'filePath', 'icon', 'password']);

  for (const [key, val] of Object.entries(obj)) {
    if (skipKeys.has(key)) {
      result[key] = val;
    } else if (typeof val === 'string') {
      result[key] = toUpper(val);
    } else if (Array.isArray(val)) {
      result[key] = val.map(item => typeof item === 'string' ? toUpper(item) : sanitizeUppercasePayload(item));
    } else if (val && typeof val === 'object' && !(val instanceof Date)) {
      result[key] = sanitizeUppercasePayload(val);
    } else {
      result[key] = val;
    }
  }

  return result as T;
}
