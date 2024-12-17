import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles/theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<Props> = ({ isOpen, onClose }) => {
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];

  if (!isOpen) return null;

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu */}
      <div className={`absolute right-0 top-0 h-full w-64 ${t.paper} shadow-lg`}>
        <div className="p-4">
          <button
            onClick={onClose}
            className={`${t.text.primary} hover:opacity-80 mb-6`}
          >
            Close
          </button>

          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block ${t.text.primary} hover:opacity-80 py-2`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
