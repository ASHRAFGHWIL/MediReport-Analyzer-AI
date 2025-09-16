import React, { useState, useRef, useEffect } from 'react';
import type { FontSize, Language } from '../types';
import { translations } from '../constants';
import { FontSizeIcon } from './IconComponents';

interface FontSizeSwitcherProps {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: Language;
}

const FontSizeSwitcher: React.FC<FontSizeSwitcherProps> = ({ fontSize, setFontSize, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const options: {key: FontSize, label: string}[] = [
    { key: 'sm', label: t.fontSizeSmall },
    { key: 'base', label: t.fontSizeNormal },
    { key: 'lg', label: t.fontSizeLarge },
  ];

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
        aria-label={t.fontSizeToggle}
      >
        <FontSizeIcon className="w-5 h-5" /> 
      </button>
      
      {isOpen && (
        <div className={`absolute top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${language === 'ar' ? 'start-0' : 'end-0'}`}>
          <div className="py-1">
            {options.map(option => (
              <button
                key={option.key}
                onClick={() => {
                  setFontSize(option.key);
                  setIsOpen(false);
                }}
                className={`block w-full text-start px-4 py-2 text-sm ${
                  fontSize === option.key 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSizeSwitcher;