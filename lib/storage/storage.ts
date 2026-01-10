const STORAGE_VERSION = '1.0.0';
const STORAGE_VERSION_KEY = 'giftpal:schema:version';

export function getStorageVersion(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_VERSION_KEY);
}

export function setStorageVersion(version: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_VERSION_KEY, version);
}

export function needsMigration(): boolean {
  const current = getStorageVersion();
  return current === null || current !== STORAGE_VERSION;
}

export function resetStorage(): void {
  if (typeof window === 'undefined') return;
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('giftpal:')) {
      localStorage.removeItem(key);
    }
  });
}

export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing storage item ${key}:`, error);
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export { STORAGE_VERSION };
