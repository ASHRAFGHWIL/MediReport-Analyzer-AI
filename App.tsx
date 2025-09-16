import React, { useState, useEffect } from 'react';
import type { Language, AnalysisResult, HistoryItem, Theme, FontSize } from './types';
import { translations } from './constants';
import { analyzeMedicalReport } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import Disclaimer from './components/Disclaimer';
import LanguageSwitcher from './components/LanguageSwitcher';
import HistoryPanel from './components/HistoryPanel';
import FontSizeSwitcher from './components/FontSizeSwitcher';
import { MoonIcon, SunIcon, ExpandIcon, ContractIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }

      const storedFontSize = localStorage.getItem('fontSize') as FontSize | null;
      if (storedFontSize) {
        setFontSize(storedFontSize);
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  }, [theme]);
  
  useEffect(() => {
    let sizeInRem = '1rem'; // base (16px)
    if (fontSize === 'sm') sizeInRem = '0.875rem'; // 14px
    if (fontSize === 'lg') sizeInRem = '1.125rem'; // 18px
    
    document.documentElement.style.fontSize = sizeInRem;
    
    try {
      localStorage.setItem('fontSize', fontSize);
    } catch (e) {
      console.error("Failed to save font size to localStorage", e);
    }
  }, [fontSize]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullScreen(false));
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const handleFileUpload = async (file: File, base64: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentFile(file);

    try {
      const result = await analyzeMedicalReport(base64, mimeType);
      setAnalysisResult(result);

      const newHistoryItem: HistoryItem = {
        analysis: result,
        timestamp: new Date().toISOString(),
        fileName: file.name,
      };
      updateHistory([newHistoryItem, ...history]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItemFromHistory = (item: HistoryItem) => {
    setAnalysisResult(item.analysis);
    setCurrentFile(new File([], item.fileName)); // Mock file for display purposes
    setError(null);
    setIsLoading(false);
  };

  const handleClearHistory = () => {
    updateHistory([]);
    setAnalysisResult(null);
    setCurrentFile(null);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.appName}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            <FontSizeSwitcher fontSize={fontSize} setFontSize={setFontSize} language={language} />
            <button onClick={handleToggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" aria-label={t.themeToggle}>
              {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
            </button>
            <button onClick={handleToggleFullScreen} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" aria-label={t.fullscreenToggle}>
              {isFullScreen ? <ContractIcon className="w-5 h-5"/> : <ExpandIcon className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              isLoading={isLoading} 
              language={language}
              setError={setError}
            />
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            { (isLoading || analysisResult) && 
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                {currentFile && <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Showing results for: <span className="font-medium text-slate-700 dark:text-slate-200">{currentFile.name}</span></p>}
                <AnalysisDisplay isLoading={isLoading} analysisResult={analysisResult} language={language} />
              </div>
            }
            <Disclaimer language={language} />
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel 
              history={history}
              onSelectItem={handleSelectItemFromHistory}
              onClearHistory={handleClearHistory}
              language={language}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;