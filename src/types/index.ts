export interface AppSettings {
  theme: 'light' | 'dark';
  namesPerPage: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  namesPerPage: 5
};

export type NameCategory = 'none' | 'business' | 'product' | 'character';

export interface NameHistoryItem {
  prompt: string;
  names: string[];
  category: NameCategory;
  timestamp: number;
}

export interface StorageService {
  getSettings: () => AppSettings | null;
  setSettings: (settings: AppSettings) => void;
  getFavorites: () => string[];
  setFavorites: (favorites: string[]) => void;
  getHistory: () => NameHistoryItem[];
  setHistory: (history: NameHistoryItem[]) => void;
}
