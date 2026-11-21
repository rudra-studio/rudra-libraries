import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ThemeMode = 'light' | 'dark';

export function themeModeClass(themeMode: ThemeMode = 'dark') {
  return themeMode === 'light' ? 'light' : 'dark';
}
