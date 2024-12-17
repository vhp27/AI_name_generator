import { AppSettings, NameCategory, NameHistoryItem } from '../types';

interface Analytics {
  apiCalls: number;
  lastApiCall: number;
  generatedNames: number;
  favorites: number;
  exports: number;
}

const STORAGE_KEYS = {
  SETTINGS: 'settings',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  ANALYTICS: 'name_analytics'
} as const;

class StorageService {
  private static instance: StorageService;
  private readonly MAX_HISTORY_ITEMS = 50;

  private constructor() {
    this.initializeAnalytics();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private initializeAnalytics(): void {
    const analytics = this.getAnalytics();
    if (!analytics) {
      this.setAnalytics({
        apiCalls: 0,
        lastApiCall: 0,
        generatedNames: 0,
        favorites: 0,
        exports: 0
      });
    }
  }

  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getSettings(): AppSettings | null {
    return this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
  }

  public setSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  public getFavorites(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.FAVORITES) || [];
  }

  public setFavorites(favorites: string[]): void {
    this.setItem(STORAGE_KEYS.FAVORITES, favorites);
  }

  public addToFavorites(name: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(name)) {
      favorites.push(name);
      this.setFavorites(favorites);
      this.incrementAnalytics('favorites');
    }
  }

  public removeFromFavorites(name: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(name);
    if (index > -1) {
      favorites.splice(index, 1);
      this.setFavorites(favorites);
      this.incrementAnalytics('favorites', -1);
    }
  }

  public getHistory(): NameHistoryItem[] {
    return this.getItem<NameHistoryItem[]>(STORAGE_KEYS.HISTORY) || [];
  }

  public setHistory(history: NameHistoryItem[]): void {
    this.setItem(STORAGE_KEYS.HISTORY, history);
  }

  public addToHistory(prompt: string, names: string[], category: NameCategory): void {
    const history = this.getHistory();
    const newItem: NameHistoryItem = {
      prompt,
      names,
      timestamp: Date.now(),
      category
    };

    history.unshift(newItem);
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history.pop();
    }

    this.setHistory(history);
    this.incrementAnalytics('generatedNames', names.length);
  }

  public clearHistory(): void {
    this.setHistory([]);
  }

  public clearFavorites(): void {
    this.setFavorites([]);
  }

  private getAnalytics(): Analytics | null {
    return this.getItem<Analytics>(STORAGE_KEYS.ANALYTICS);
  }

  private setAnalytics(analytics: Analytics): void {
    this.setItem(STORAGE_KEYS.ANALYTICS, analytics);
  }

  private incrementAnalytics(key: keyof Analytics, amount: number = 1): void {
    const analytics = this.getAnalytics();
    if (analytics) {
      analytics[key] += amount;
      this.setAnalytics(analytics);
    }
  }

  public recordApiCall(): void {
    this.incrementAnalytics('apiCalls');
    const analytics = this.getAnalytics();
    if (analytics) {
      analytics.lastApiCall = Date.now();
      this.setAnalytics(analytics);
    }
  }

  public recordExport(): void {
    this.incrementAnalytics('exports');
  }
}

export const storageService = StorageService.getInstance();
