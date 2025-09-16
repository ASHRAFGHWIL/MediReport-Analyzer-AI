
import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisResult, Language } from './types';
import { analyzeMedicalReport } from './services/geminiService';
import { translations } from './constants';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import Disclaimer from './components/Disclaimer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LogoIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = `${language === 'ar' ? 'font-cairo' : 'font-sans'} bg-slate-50 text-slate-800`;
  }, [language]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError(translations[language].errorNoFile);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        if (!base64String) {
          setError(translations[language].errorFileRead);
          setIsLoading(false);
          return;
        }

        const result = await analyzeMedicalReport(base64String, selectedFile.type);
        setAnalysisResult(result);
      };
      reader.onerror = () => {
        setError(translations[language].errorFileRead);
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      setError(translations[language].errorAnalysis);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, language]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-3">
             <LogoIcon />
             <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {translations[language].title}
             </h1>
           </div>
           <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </header>

        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">{translations[language].uploadTitle}</h2>
            <p className="text-slate-500 mb-4">{translations[language].uploadSubtitle}</p>
            <FileUpload 
              onFileChange={handleFileChange} 
              previewUrl={previewUrl} 
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              language={language}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">{translations[language].errorTitle}</p>
              <p>{error}</p>
            </div>
          )}

          <AnalysisDisplay 
            isLoading={isLoading} 
            analysisResult={analysisResult}
            language={language}
          />
        </main>

        <Disclaimer language={language} />

        <footer className="text-center mt-8 text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MediReport Analyzer AI. {translations[language].footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
   