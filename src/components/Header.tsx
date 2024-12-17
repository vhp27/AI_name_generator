import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { theme } = useTheme();
  
  return (
    <header className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link 
            to="/" 
            className={`text-2xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            <span className="text-indigo-600">GET</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>names</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium hover:text-indigo-600 transition-colors ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
