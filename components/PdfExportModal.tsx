import React, { useState, useEffect, useRef } from 'react';
import type { Language, PdfExportOptions } from '../types';
import { translations } from '../constants';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: PdfExportOptions) => void;
  reportType: 'patient' | 'doctor';
  defaultFileName: string;
  language: Language;
}

const PatientSections = (t: any) => ({
  overallImpression: { label: t.patientReport.overallImpression, value: true },
  keyFindings: { label: t.patientReport.keyFindings, value: true },
  recommendations: { label: t.patientReport.recommendations, value: true },
  medicalAdvice: { label: t.patientReport.medicalAdvice, value: true },
  nutritionalAdvice: { label: t.patientReport.nutritionalAdvice, value: true },
  disclaimer: { label: t.disclaimerTitle, value: true },
});

const DoctorSections = (t: any) => ({
  professionalSummary: { label: t.doctorReport.professionalSummary, value: true },
  detailedResults: { label: t.doctorReport.detailedResults, value: true },
  disclaimer: { label: t.disclaimerTitle, value: false }, // Default off for doctors
});

const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  reportType,
  defaultFileName,
  language,
}) => {
  const t = translations[language];
  const t_modal = t.pdfExportModal;
  const modalContentRef = useRef<HTMLDivElement>(null);

  const getInitialSections = () => reportType === 'patient' ? PatientSections(t) : DoctorSections(t);

  const [sections, setSections] = useState<{ [key: string]: { label: string; value: boolean } }>(getInitialSections());
  const [fileName, setFileName] = useState(defaultFileName);

  useEffect(() => {
    if (isOpen) {
      setFileName(defaultFileName);
      setSections(getInitialSections());
    }
  }, [isOpen, defaultFileName, reportType, language]);

   useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
    }
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onClose]);


  if (!isOpen) {
    return null;
  }

  const handleSectionChange = (key: string) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], value: !prev[key].value }
    }));
  };

  const handleExportClick = () => {
    const sectionValues = Object.entries(sections).reduce((acc, [key, { value }]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: boolean });

    onExport({
      sections: sectionValues,
      fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
    });
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
        role="dialog" 
        aria-modal="true"
        onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg" ref={modalContentRef}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {reportType === 'patient' ? t_modal.titlePatient : t_modal.titleDoctor}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t_modal.includeSections}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {Object.entries(sections).map(([key, {label, value}]) => (
                <label key={key} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleSectionChange(key)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-200">{label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t_modal.fileName}</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="text"
                    id="fileName"
                    value={fileName.replace(/\.pdf$/, '')}
                    onChange={(e) => setFileName(e.target.value)}
                    className="block w-full flex-1 rounded-none rounded-l-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-500 dark:text-slate-400">.pdf</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
          >
            {t_modal.cancel}
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
          >
            {t_modal.generatePdf}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfExportModal;
