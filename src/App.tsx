import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Settings } from './components/Settings';
import { NameGenerator } from './components/NameGenerator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AppSettings, DEFAULT_SETTINGS } from './types';
import { useTheme } from './context/ThemeContext';
import { theme } from './styles/theme';
import { MobileNav } from './components/MobileNav';
import { Donation } from './components/Donation';

function App() {
  const { theme: currentTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState<AppSettings>(() => ({
    ...DEFAULT_SETTINGS,
    theme: currentTheme
  }));
  const themeStyles = theme[currentTheme];

  useEffect(() => {
    // Keep settings in sync with theme changes
    setSettings(prev => ({ ...prev, theme: currentTheme }));
  }, [currentTheme]);

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setTheme(newSettings.theme);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200`}>
        {/* Mobile Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-opacity-90 ${themeStyles.paper} border-b border-opacity-10 ${themeStyles.border} lg:hidden`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link 
                to="/" 
                className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-colors`}
              >
                <span className="text-indigo-600">GET</span>
                <span className={themeStyles.text.primary}>names</span>
              </Link>
              <div className="flex items-center gap-2">
                <Settings settings={settings} onSettingsChange={handleSettingsChange} />
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`${themeStyles.text.primary} p-2 hover:opacity-80`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-opacity-90 ${themeStyles.paper} border-b border-opacity-10 ${themeStyles.border} hidden lg:block`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link 
                to="/" 
                className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-colors`}
              >
                <span className="text-indigo-600">GET</span>
                <span className={themeStyles.text.primary}>names</span>
              </Link>
              <div className="flex items-center gap-8">
                <Link 
                  to="/" 
                  className={`${themeStyles.text.secondary} hover:text-indigo-400 text-sm font-medium transition-colors`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`${themeStyles.text.secondary} hover:text-indigo-400 text-sm font-medium transition-colors`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`${themeStyles.text.secondary} hover:text-indigo-400 text-sm font-medium transition-colors`}
                >
                  Contact
                </Link>
                <div className={`pl-4 border-l border-opacity-10 ${themeStyles.border}`}>
                  <Settings settings={settings} onSettingsChange={handleSettingsChange} />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
          <div className="pt-16 lg:pt-20">
            <Routes>
              <Route 
                path="/" 
                element={
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                      <h1 className={`text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-3`}>
                        <span className="text-indigo-600">GET</span>
                        <span className={themeStyles.text.primary}>names</span>
                      </h1>
                      <p className={`${themeStyles.text.secondary} text-base lg:text-lg`}>
                        Generate creative names for your business, product, or character
                      </p>
                    </div>
                    <NameGenerator 
                      settings={settings}
                      onNamesGenerated={() => {}}
                    />
                  </div>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/settings" 
                element={<Settings settings={settings} onSettingsChange={handleSettingsChange} />}
              />
            </Routes>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Donation Component */}
        <Donation />

        {/* Hidden SEO footer */}
        <footer className="sr-only">
          <div itemScope itemType="http://schema.org/WebApplication">
            <meta itemProp="name" content="AI Name Generator" />
            <meta itemProp="description" content="Generate creative names for your business, product, or character using AI technology." />
            <meta itemProp="applicationCategory" content="Utility" />
            <meta itemProp="operatingSystem" content="Web Browser" />
            <div itemProp="author" itemScope itemType="http://schema.org/Organization">
              <meta itemProp="name" content="AI Name Generator" />
              <meta itemProp="url" content="https://ai-name-generator.com" />
            </div>
          </div>
          <p> {new Date().getFullYear()} AI Name Generator. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
