
import React, { useRef, useCallback } from 'react';
import type { Language } from '../types';
import { translations } from '../constants';
import { UploadIcon, DocumentIcon, AnalyzeIcon } from './IconComponents';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
  onAnalyze: () => void;
  isLoading: boolean;
  language: Language;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, previewUrl, onAnalyze, isLoading, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] ?? null;
    onFileChange(file);
  }, [onFileChange]);


  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="w-full lg:w-1/2">
        <label
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            {previewUrl ? (
                 <div className="text-slate-500 font-semibold flex items-center gap-2">
                    <DocumentIcon />
                    <span>{t.changeFile}</span>
                 </div>
            ) : (
                <>
                <UploadIcon />
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">{t.uploadPlaceholder}</span></p>
                <p className="text-xs text-slate-400">PNG, JPG or PDF</p>
                </>
            )}
          </div>
          <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileSelect} accept="image/png, image/jpeg, application/pdf" />
        </label>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center h-64 bg-slate-100 rounded-lg p-4">
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img src={previewUrl.startsWith('data:application/pdf') ? 'https://picsum.photos/seed/pdfdoc/400/200' : previewUrl} alt="Report Preview" className="w-full h-full object-contain rounded-md" />
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>{t.uploadSubtitle}</p>
          </div>
        )}
      </div>
      
      <div className="w-full lg:w-auto flex-shrink-0">
          <button
            onClick={onAnalyze}
            disabled={isLoading || !previewUrl}
            className="w-full lg:w-auto h-64 lg:h-auto flex items-center justify-center gap-3 px-6 py-3.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.analyzingButton}
              </>
            ) : (
              <>
                <AnalyzeIcon />
                {t.analyzeButton}
              </>
            )}
          </button>
      </div>
    </div>
  );
};

export default FileUpload;
   