import React from 'react';
import { theme } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

export const About: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const t = theme[currentTheme];
  const c = theme.common;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
        <h1 className={`text-2xl lg:text-3xl font-bold ${t.text.primary} mb-6`}>About GETnames</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className={`text-xl lg:text-2xl font-semibold ${t.text.primary} mb-3`}>Our Mission</h2>
            <p className={`${t.text.secondary} text-sm lg:text-base`}>
              GETnames is dedicated to helping individuals and businesses find the perfect name for their ventures. 
              We combine AI technology with creative algorithms to generate unique and meaningful names that resonate with your brand identity.
            </p>
          </div>

          <div>
            <h2 className={`text-xl lg:text-2xl font-semibold ${t.text.primary} mb-3`}>How It Works</h2>
            <div className={`space-y-4 ${t.text.secondary} text-sm lg:text-base`}>
              <p>
                Our advanced AI model analyzes your description and requirements to generate names that are:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Unique and memorable</li>
                <li>Relevant to your industry</li>
                <li>Available as domain names</li>
                <li>Brand-friendly</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className={`text-xl lg:text-2xl font-semibold ${t.text.primary} mb-3`}>Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 ${t.paper} ${c.rounded}`}>
                <h3 className={`text-lg font-medium ${t.text.primary} mb-2`}>AI-Powered</h3>
                <p className={`${t.text.secondary} text-sm`}>
                  Utilizes advanced AI models to generate creative and contextual names
                </p>
              </div>
              <div className={`p-4 ${t.paper} ${c.rounded}`}>
                <h3 className={`text-lg font-medium ${t.text.primary} mb-2`}>Customizable</h3>
                <p className={`${t.text.secondary} text-sm`}>
                  Generate names based on specific categories and requirements
                </p>
              </div>
              <div className={`p-4 ${t.paper} ${c.rounded}`}>
                <h3 className={`text-lg font-medium ${t.text.primary} mb-2`}>History</h3>
                <p className={`${t.text.secondary} text-sm`}>
                  Keep track of previously generated names
                </p>
              </div>
              <div className={`p-4 ${t.paper} ${c.rounded}`}>
                <h3 className={`text-lg font-medium ${t.text.primary} mb-2`}>Favorites</h3>
                <p className={`${t.text.secondary} text-sm`}>
                  Save and organize your favorite names
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
