
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
    <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md shadow-sm" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon />
        </div>
        <div className="ms-3">
          <p className="text-sm font-bold">{t.disclaimerTitle}</p>
          <p className="mt-1 text-sm">{t.disclaimerContent}</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
   