import React, { useState } from 'react';
import { AppSettings, NameCategory, NameHistoryItem } from '../types';
import { generateNames } from '../services/nameGenerator';
import { storageService } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';
import { ToastManager } from './Toast';

interface Props {
  settings: AppSettings;
  onNamesGenerated: (names: string[]) => void;
}

const categories: NameCategory[] = ['character', 'business', 'place', 'item', 'custom'];

export const NameGenerator: React.FC<Props> = ({ settings, onNamesGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NameCategory>(settings.category);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [visibleNames, setVisibleNames] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [history, setHistory] = useState<NameHistoryItem[]>(() => storageService.getHistory());
  const [expandedHistoryItems, setExpandedHistoryItems] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];
  const c = theme.common;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!prompt.trim()) {
      setError('Please enter a description');
      ToastManager.show({ message: 'Please enter a description', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const names = await generateNames({
        ...settings,
        category: selectedCategory,
        customPrompt: prompt
      });

      if (!names || names.length === 0) {
        throw new Error('No names were generated. Please try again.');
      }

      if (names.length < settings.numNames) {
        ToastManager.show({ message: `Only ${names.length} names were generated`, type: 'info' });
      }

      setAllNames(names);
      setVisibleNames(names.slice(0, settings.namesPerPage));
      setCurrentPage(1);
      onNamesGenerated(names);
      
      // Save to history
      const historyItem: NameHistoryItem = {
        prompt,
        names,
        category: selectedCategory,
        timestamp: Date.now()
      };
      const updatedHistory = [historyItem, ...history];
      setHistory(updatedHistory);
      storageService.setHistory(updatedHistory);
      
      ToastManager.show({ message: 'Names generated successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate names. Please try again.';
      setError(errorMessage);
      console.error('Error generating names:', error);
      ToastManager.show({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const startIndex = visibleNames.length;
      const endIndex = Math.min(nextPage * settings.namesPerPage, allNames.length);
      
      if (startIndex >= endIndex) {
        ToastManager.show({ message: 'No more names to load', type: 'info' });
        return;
      }

      const newNames = allNames.slice(0, endIndex);
      setVisibleNames(newNames);
      setCurrentPage(nextPage);
      
      if (newNames.length === allNames.length) {
        ToastManager.show({ message: 'All names loaded', type: 'success' });
      }
    } catch (error) {
      console.error('Error loading more names:', error);
      ToastManager.show({ message: 'Failed to load more names', type: 'error' });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFavoriteClick = (name: string) => {
    if (favorites.includes(name)) {
      const newFavorites = favorites.filter(n => n !== name);
      setFavorites(newFavorites);
      storageService.setFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, name];
      setFavorites(newFavorites);
      storageService.setFavorites(newFavorites);
    }
  };

  const handleCopyName = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      ToastManager.show({ message: 'Name copied to clipboard!', type: 'success' });
    } catch (error) {
      console.error('Failed to copy:', error);
      ToastManager.show({ message: 'Failed to copy name', type: 'error' });
    }
  };

  const handleExport = (names: string[]) => {
    const text = names.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-names.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    ToastManager.show({ message: 'Names exported successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className={`block text-sm font-medium ${t.text.secondary} mb-2`}>
                Description
              </label>
              <input
                type="text"
                id="description"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a description for your name"
                className={`w-full px-4 py-2 ${c.rounded} border transition-colors duration-200 ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus} ${t.input.hover}`}
              />
            </div>
            <div>
              <label htmlFor="category" className={`block text-sm font-medium ${t.text.secondary} mb-2`}>
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as NameCategory)}
                className={`w-full px-4 py-2 ${c.rounded} border transition-colors duration-200 ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus} ${t.input.hover}`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className={t.input.background}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 ${c.rounded} bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors disabled:bg-indigo-400`}
            >
              {isLoading ? 'Generating...' : 'Generate Names'}
            </button>

            <div className="flex gap-2 justify-center pt-4">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 ${showHistory ? t.button.primary : t.button.secondary} rounded-lg transition-colors duration-200 font-medium`}
              >
                History
              </button>
              <button
                type="button"
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-4 py-2 ${showFavorites ? t.button.primary : t.button.secondary} rounded-lg transition-colors duration-200 font-medium`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {visibleNames.length > 0 && (
        <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${t.text.primary}`}>Generated Names</h2>
              <p className={`text-sm ${t.text.secondary} mt-1`}>
                Showing {visibleNames.length} of {allNames.length} names
              </p>
            </div>
            <button
              onClick={() => handleExport(allNames)}
              className={`px-3 py-1.5 text-sm ${t.button.secondary} rounded-md hover:bg-opacity-80 transition-colors`}
            >
              Export All
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md`}>
              {error}
            </div>
          )}

          <div className="space-y-2">
            {visibleNames.map((name, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 ${t.paper} ${c.rounded} border ${t.border} ${t.listItem.hover}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${t.text.secondary}`}>{index + 1}.</span>
                  <span className={`${t.text.primary} font-medium`}>{name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyName(name)}
                    className={`px-3 py-1.5 text-sm ${t.button.secondary} rounded-md hover:bg-opacity-80 transition-colors`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleFavoriteClick(name)}
                    className={`p-1.5 ${t.button.secondary} rounded-md hover:bg-opacity-80 transition-colors`}
                  >
                    {favorites.includes(name) ? '★' : '☆'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {visibleNames.length < allNames.length && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`mt-4 w-full p-2 ${t.button.secondary} ${c.rounded} ${
                isLoadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
              }`}
            >
              {isLoadingMore ? 'Loading...' : `Load More (${allNames.length - visibleNames.length} remaining)`}
            </button>
          )}
        </div>
      )}

      {/* History Section */}
      {showHistory && history.length > 0 && (
        <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
          <h2 className={`text-xl font-semibold ${t.text.primary} mb-4`}>History</h2>
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className={`border ${t.border} ${c.rounded} overflow-hidden`}
              >
                <div 
                  className={`p-4 ${t.paper} cursor-pointer flex justify-between items-center`}
                  onClick={() => {
                    const newExpandedItems = expandedHistoryItems.includes(index)
                      ? expandedHistoryItems.filter(i => i !== index)
                      : [...expandedHistoryItems, index];
                    setExpandedHistoryItems(newExpandedItems);
                  }}
                >
                  <div>
                    <p className={`${t.text.primary} font-medium`}>{item.prompt}</p>
                    <p className={`${t.text.secondary} text-sm mt-1`}>
                      Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 ${t.text.secondary} transform transition-transform ${
                      expandedHistoryItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedHistoryItems.includes(index) && (
                  <div className="p-4 space-y-2">
                    {item.names.map((name, nameIndex) => (
                      <div
                        key={nameIndex}
                        className={`flex items-center justify-between p-3 ${t.paper} ${c.rounded} border ${t.border}`}
                      >
                        <span className={t.text.primary}>{name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyName(name)}
                            className={`text-sm ${t.button.secondary} hover:opacity-80`}
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleFavoriteClick(name)}
                            className={`${t.button.secondary} hover:opacity-80`}
                          >
                            {favorites.includes(name) ? '★' : '☆'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Section */}
      {showFavorites && favorites.length > 0 && (
        <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
          <h2 className={`text-xl font-semibold ${t.text.primary} mb-4`}>Favorites</h2>
          <div className="space-y-2">
            {favorites.map((name, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 ${t.paper} ${c.rounded} border ${t.border}`}
              >
                <span className={t.text.primary}>{name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyName(name)}
                    className={`text-sm ${t.button.secondary} hover:opacity-80`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleFavoriteClick(name)}
                    className={`${t.button.secondary} hover:opacity-80`}
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
