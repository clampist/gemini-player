export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-{2,}/g, '-');
}

export function timestamp(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const millis = pad(now.getMilliseconds(), 3);

  return `${year}${month}${day}-${hours}${minutes}${seconds}.${millis}`;
}

export const jpRegex = /[ぁ-んァ-ン一-龯]/;

export function containsJapanese(text: string): boolean {
  return jpRegex.test(text);
}

export function getBaseOrigin(): string {
  const fallback = 'https://gemini.google.com/app';
  const base = process.env.BASE_URL ?? fallback;
  try {
    return new URL(base).origin;
  } catch {
    return fallback.replace(/\/+$/, '');
  }
}

