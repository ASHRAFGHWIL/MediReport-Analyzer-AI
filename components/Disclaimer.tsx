import React from 'react';
import type { Language } from '../types';
import { translations } from '../constants';
import { WarningIcon } from './IconComponents';

interface DisclaimerProps {
  language: Language;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="mt-8 bg-black border-l-4 border-yellow-400 p-4 rounded-md shadow-sm" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon />
        </div>
        <div className="ms-3">
          <p className="text-sm font-bold text-yellow-200">{t.disclaimerTitle}</p>
          <p className="mt-1 text-sm text-yellow-300">{t.disclaimerContent}</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;