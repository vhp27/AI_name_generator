import React from 'react';
import { Link } from 'react-router-dom';
import { NameGenerator } from '../components/NameGenerator';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  onNamesGenerated: (names: string[]) => void;
}

export const Generator: React.FC<Props> = ({ settings, onNamesGenerated }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
      <NameGenerator
        settings={settings}
        onNamesGenerated={onNamesGenerated}
      />
    </div>
  );
};
