import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

export const Donation: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];
  const c = theme.common;

  useEffect(() => {
    // Show popup after 4 minutes
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 240000);

    // Handle scroll for mobile devices
    const handleScroll = () => {
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setHasScrolledToBottom(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(popupTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDonateClick = () => {
    window.open('https://buymeacoffee.com/vhp327', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Donation Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${t.paper} ${c.rounded} ${c.shadow} p-6 max-w-md mx-4`}>
            <h2 className={`text-xl font-bold mb-4 ${t.text.primary}`}>Support GETnames</h2>
            <p className={`mb-6 ${t.text.secondary}`}>
              Help us keep this AI name generator free and accessible to everyone! Your support helps cover our AI costs 
              and enables continuous improvements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className={`px-6 py-2 ${c.rounded} ${t.button.secondary} transition-colors duration-200`}
              >
                Maybe later
              </button>
              <button
                onClick={handleDonateClick}
                className={`px-6 py-2 ${c.rounded} bg-indigo-600 text-white hover:bg-indigo-500 transition-colors duration-200`}
              >
                Buy me a coffee ☕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Donation Button */}
      <div 
        className={`
          fixed bottom-4 right-4 z-40
          ${hasScrolledToBottom ? 'sm:block' : 'hidden sm:block'}
          transition-all duration-300
        `}
      >
        <button
          onClick={handleDonateClick}
          className={`
            group
            flex items-center gap-2
            px-4 py-2
            ${c.rounded}
            bg-indigo-600 hover:bg-indigo-500
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-200
            transform hover:scale-105
          `}
        >
          <span className="hidden sm:inline">Support Me</span>
          <span>☕</span>
        </button>
      </div>
    </>
  );
};
