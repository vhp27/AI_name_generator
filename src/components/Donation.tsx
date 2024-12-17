import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

// Featured donors - update this list as needed
const FEATURED_DONORS = [
  { name: 'John D.', amount: '☕️ x 3', message: 'Amazing tool!' },
  { name: 'Sarah M.', amount: '☕️ x 2', message: 'Keep up the great work!' },
  { name: 'Alex R.', amount: '☕️ x 5', message: 'Helped name my startup!' },
];

export const Donation: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];
  const c = theme.common;

  useEffect(() => {
    // Show popup after 3 minutes of active usage
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 180000);

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
      {/* Fixed Donation Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${t.paper} border-t ${t.border} shadow-lg z-50 transition-all duration-300 transform ${hasScrolledToBottom ? 'translate-y-0' : 'translate-y-full'} lg:translate-y-0`}
        style={{ marginBottom: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className={`text-sm sm:text-base font-medium ${t.text.primary} text-center sm:text-left`}>
                🌟 Donate to keep this tool free and get your name featured here!
              </p>
              <p className={`text-xs ${t.text.secondary} mt-1 text-center sm:text-left`}>
                Your support helps us maintain and improve GETnames
              </p>
            </div>
            <button
              onClick={handleDonateClick}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              ☕️ Buy me a coffee
            </button>
          </div>
        </div>
      </div>

      {/* Donation Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${t.paper} ${c.rounded} ${c.shadow} p-6 max-w-md mx-4`}>
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-xl font-bold ${t.text.primary}`}>Support GETnames ❤️</h2>
              <button
                onClick={() => setShowPopup(false)}
                className={`${t.text.secondary} hover:${t.text.primary} p-1`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className={`mb-4 ${t.text.secondary}`}>
              Help us keep this AI name generator free and accessible to everyone! Your support helps cover our AI costs 
              and enables continuous improvements.
            </p>

            {/* Featured Donors */}
            <div className={`mb-6 p-4 ${t.paper} border ${t.border} rounded-lg`}>
              <h3 className={`text-sm font-medium ${t.text.primary} mb-3`}>⭐ Featured Supporters</h3>
              <div className="space-y-2">
                {FEATURED_DONORS.map((donor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${t.text.primary}`}>{donor.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${t.text.secondary}`}>{donor.amount}</span>
                      <span className="text-xs text-indigo-500">{donor.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDonateClick}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex-1"
              >
                ☕️ Buy me a coffee
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className={`px-6 py-3 ${c.rounded} ${t.button.secondary} transition-colors duration-200`}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
