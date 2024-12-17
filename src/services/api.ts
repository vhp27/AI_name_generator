interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiService {
  private static instance: ApiService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private requestCounts: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT = 5; // requests per minute
  private readonly RATE_WINDOW = 60 * 1000; // 1 minute

  private constructor() {
    // Initialize cache using localStorage for persistence across page reloads
    try {
      const savedCache = localStorage.getItem('apiCache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        Object.entries(parsed).forEach(([key, value]) => {
          this.cache.set(key, value as CacheItem<any>);
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private cleanupCache() {
    const now = Date.now();
    let cleaned = false;
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
        cleaned = true;
      }
    });
    
    if (cleaned) {
      this.saveCache();
    }
  }

  private saveCache() {
    try {
      const cacheData: Record<string, CacheItem<any>> = {};
      this.cache.forEach((value, key) => {
        cacheData[key] = value;
      });
      localStorage.setItem('apiCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private checkRateLimit(endpoint: string): boolean {
    const now = Date.now();
    const windowStart = now - this.RATE_WINDOW;
    
    // Clean up old request counts
    this.requestCounts.forEach((_count, key) => {
      if (parseInt(key.split(':')[1]) < windowStart) {
        this.requestCounts.delete(key);
      }
    });

    // Count recent requests
    const recentRequests = Array.from(this.requestCounts.entries())
      .filter(([key]) => key.startsWith(endpoint) && parseInt(key.split(':')[1]) >= windowStart)
      .reduce((sum, [, count]) => sum + count, 0);

    return recentRequests < this.RATE_LIMIT;
  }

  private async handleRateLimit(endpoint: string): Promise<void> {
    const now = Date.now();
    const key = `${endpoint}:${now}`;
    
    // Increment request count
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    
    // Check if we're over the rate limit
    if (!this.checkRateLimit(endpoint)) {
      const delay = this.calculateBackoff();
      console.log(`Rate limit exceeded, waiting ${delay}ms before retry`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  private calculateBackoff(): number {
    const recentRequests = Array.from(this.requestCounts.values()).reduce((sum, count) => sum + count, 0);
    return Math.min(1000 * Math.pow(2, recentRequests - this.RATE_LIMIT), 30000); // Max 30s delay
  }

  public async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `${options.method || 'GET'}:${url}:${options.body || ''}`;
    
    // Clean up old cache entries
    this.cleanupCache();
    
    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('Returning cached response for:', url);
        return cached.data as T;
      }
    }

    // Handle rate limiting
    await this.handleRateLimit(url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || 
          `API request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Cache successful GET responses
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        this.saveCache();
      }

      return data as T;
    } catch (error: any) {
      console.error('API request failed:', error);
      // Clear invalid cache entry if it exists
      this.cache.delete(cacheKey);
      this.saveCache();
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
