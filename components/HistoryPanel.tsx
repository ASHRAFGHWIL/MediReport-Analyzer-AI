import React from 'react';
import type { HistoryItem, Language } from '../types';
import { translations } from '../constants';
import { HistoryIcon, TrashIcon } from './IconComponents';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  language: Language;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, onClearHistory, language }) => {
  const t = translations[language].history;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{t.title}</h2>
        </div>
        {history.length > 0 && (
            <button 
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 rounded-md transition-colors"
                aria-label={t.clear}
            >
                <TrashIcon className="w-4 h-4"/>
                <span>{t.clear}</span>
            </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto -mr-3 pr-3">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
            <p>{t.noHistory}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((item, index) => (
              <li key={item.timestamp + index}>
                <button
                  onClick={() => onSelectItem(item)}
                  className="w-full text-start p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all dark:bg-slate-700/50 dark:border-slate-700 dark:hover:bg-blue-900/50 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{item.fileName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.analyzedOn} {formatDate(item.timestamp)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;