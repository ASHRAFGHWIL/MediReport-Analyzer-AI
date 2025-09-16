import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Language } from '../types';
import { translations } from '../constants';

interface FileUploadProps {
  onFileUpload: (file: File, base64: string, mimeType: string) => void;
  isLoading: boolean;
  language: Language;
  setError: (error: string | null) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, language, setError }) => {
  const t = translations[language].fileUpload;

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      const { errors } = fileRejections[0];
      if (errors.some((e: any) => e.code === 'file-too-large')) {
        setError(t.fileTooLarge);
      } else if (errors.some((e: any) => e.code === 'file-invalid-type')) {
        setError(t.invalidFileType);
      } else {
        setError(t.error);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        onFileUpload(file, base64, file.type);
      };
      reader.onerror = () => {
        setError(t.error);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileUpload, setError, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.description}</p>
        
        <div
            {...getRootProps()}
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25Z" />
                </svg>

                {isLoading ? (
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{t.analyzing}</p>
                ) : (
                    <p>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{t.selectFile}</span> {t.orDrag}
                    </p>
                )}
                <p className="text-xs mt-1">{t.fileTypes}</p>
            </div>
        </div>
    </div>
  );
};

export default FileUpload;