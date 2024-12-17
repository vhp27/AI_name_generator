import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';
import { theme } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

interface Props {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const Settings: React.FC<Props> = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];
  const c = theme.common;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    onSettingsChange({ ...settings, theme: newTheme });
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="relative inline-block" ref={settingsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${c.button} ${t.button.outline} flex items-center gap-2 p-2`}
        aria-label="Settings"
      >
        <svg
          className={`w-5 h-5 ${t.text.primary}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-64 ${t.paper} ${c.rounded} ${c.shadow} p-4 border ${t.border} z-50`}
          style={{
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            right: '0',
            top: '100%'
          }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-lg font-medium ${t.text.primary}`}>Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`${t.text.secondary} hover:${t.text.primary} p-1`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${t.text.secondary}`}>
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                className={`w-full ${c.input} ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus}`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${t.text.secondary}`}>
                Number of Names to Generate (1-30)
              </label>
              <input
                type="number"
                id="numNames"
                min="1"
                max="30"
                value={settings.numNames}
                onChange={(e) => {
                  const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 30);
                  handleSettingChange('numNames', value);
                }}
                className={`w-full ${c.input} ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus}`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${t.text.secondary}`}>
                Names Per Page
              </label>
              <input
                type="number"
                id="namesPerPage"
                min="1"
                max={settings.numNames}
                value={settings.namesPerPage}
                onChange={(e) => {
                  const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), settings.numNames);
                  handleSettingChange('namesPerPage', value);
                }}
                className={`w-full ${c.input} ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
