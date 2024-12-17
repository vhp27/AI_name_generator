export type Theme = 'light' | 'dark';

export type NameCategory = 'character' | 'business' | 'place' | 'item' | 'custom';

export interface AppSettings {
  theme: Theme;
  category: NameCategory;
  customPrompt: string;
  numNames: number;
  maxLength: number;
  temperature: number;
  namesPerPage: number;
}

export interface NameHistoryItem {
  prompt: string;
  names: string[];
  timestamp: number;
  category: NameCategory;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  category: 'custom',
  customPrompt: '',
  numNames: 20,
  maxLength: 20,
  temperature: 0.7,
  namesPerPage: 10
};
