import { AppSettings } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = {
  PRIMARY: "meta-llama/llama-3.2-1b-instruct:free",
  FALLBACK: "meta-llama/llama-3.1-70b-instruct:free",
  BACKUP: "meta-llama/llama-3.2-3b-instruct:free"
};

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const API_TIMEOUT = 30000; // 30 seconds

const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection and try again.',
  API_KEY: 'API configuration error. Please try again later or contact support.',
  TIMEOUT: 'Request timed out. Please try again.',
  NO_NAMES: 'No names were generated. Please try a different description or category.',
  UNKNOWN: 'An unexpected error occurred. Please try again.'
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const createPromptContent = (settings: AppSettings): string => {
  const { category, customPrompt } = settings;
  
  if (customPrompt) {
    return `Generate creative and unique names based on this description: ${customPrompt}. 
    The names should be memorable, distinctive, and suitable for their intended purpose. 
    Provide only the names as a comma-separated list, without any additional explanation or commentary.`;
  }

  const basePrompt = "Generate unique and creative names. Provide only the names as a comma-separated list, without any additional explanation or commentary. ";
  
  switch (category) {
    case 'character':
      return basePrompt + "The names should be suitable for fictional characters, conveying personality and memorability.";
    case 'business':
      return basePrompt + "The names should be professional, trustworthy, and suitable for a business or brand.";
    case 'place':
      return basePrompt + "The names should evoke a sense of location and atmosphere, suitable for fictional places or landmarks.";
    case 'item':
      return basePrompt + "The names should be distinctive and suitable for products, artifacts, or special items.";
    case 'custom':
    default:
      return basePrompt + "The names should be memorable and distinctive.";
  }
};

export const generateNames = async (settings: AppSettings): Promise<string[]> => {
  const { numNames = 25, temperature = 0.7 } = settings;
  const prompt = createPromptContent(settings);

  if (!OPENROUTER_API_KEY) {
    throw new Error(ERROR_MESSAGES.API_KEY);
  }

  const models = [MODELS.PRIMARY, MODELS.FALLBACK, MODELS.BACKUP];
  let lastError = null;

  for (const model of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const requestBody = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a creative name generator. Generate names based on the given prompt. Return only the names as a comma-separated list.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature,
          max_tokens: 1000,
        };

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Name Generator',
          'Origin': window.location.origin,
        };
        
        const response = await fetchWithTimeout(
          API_URL,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
          },
          API_TIMEOUT
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || ERROR_MESSAGES.UNKNOWN}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
        const names = content.split(',')
          .map((name: string) => name.trim())
          .filter((name: string) => name.length > 0)
          .slice(0, numNames);

        if (names.length === 0) {
          throw new Error(ERROR_MESSAGES.NO_NAMES);
        }

        return names;
      } catch (error) {
        lastError = error;

        // If it's not the last retry and not the last model, wait before retrying
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }
        
        // If it's the last retry for this model, try the next model
        break;
      }
    }
  }

  throw lastError || new Error(ERROR_MESSAGES.UNKNOWN);
};
