import React from 'react';
import { theme } from '../styles/theme';
import { NameHistoryItem } from '../types';
import { ToastManager } from './Toast';

interface Props {
  theme: 'light' | 'dark';
  history: NameHistoryItem[];
  onCopyName: (name: string) => void;
  onAddToFavorites: (name: string) => void;
}

export const NameHistory: React.FC<Props> = ({ theme: currentTheme, history, onCopyName, onAddToFavorites }) => {
  const t = theme[currentTheme];
  const c = theme.common;

  const handleCopyName = (name: string) => {
    onCopyName(name);
    ToastManager.show({ message: 'Name copied to clipboard!', type: 'success' });
  };

  if (history.length === 0) {
    return (
      <div className={`${t.paper} ${c.rounded} ${c.shadow} p-6 text-center`}>
        <p className={t.text.secondary}>No history yet</p>
      </div>
    );
  }

  return (
    <div className={`${t.paper} ${c.rounded} ${c.shadow} p-6`}>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.timestamp} className={`p-4 ${t.paper} ${c.rounded}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`${t.text.secondary} text-sm`}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
                <p className={`${t.text.primary} font-medium`}>{item.prompt}</p>
              </div>
              <span className={`px-2 py-1 text-sm rounded ${t.button.secondary}`}>
                {item.category}
              </span>
            </div>
            <div className="mt-2">
              {item.names.map((name, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`${t.text.primary}`}>{name}</span>
                  <button
                    onClick={() => handleCopyName(name)}
                    className={`${t.button.secondary} text-sm rounded`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => onAddToFavorites(name)}
                    className={`${t.button.secondary} text-sm rounded`}
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
