import React from 'react';
import type { Language } from '../types';

const LoadingSpinner: React.FC<{ language: Language }> = ({ language }) => {
  const messages = {
    en: [
        "Analyzing medical data...",
        "Applying clinical knowledge...",
        "Comparing with reference values...",
        "Generating insights...",
        "Finalizing reports...",
    ],
    ar: [
        "جاري تحليل البيانات الطبية...",
        "تطبيق المعرفة السريرية...",
        "المقارنة مع القيم المرجعية...",
        "توليد الرؤى والتحليلات...",
        "وضع اللمسات الأخيرة على التقارير...",
    ]
  };
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % messages[language].length);
    }, 2500);
    return () => clearInterval(interval);
  }, [language, messages]);

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
        <svg className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-600 dark:text-slate-300 font-medium transition-opacity duration-500">
            {messages[language][messageIndex]}
        </p>
    </div>
  );
};

export default LoadingSpinner;