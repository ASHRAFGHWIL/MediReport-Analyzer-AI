import React, { useState } from 'react';
import type { PatientSummary, Language } from '../types';
import { translations } from '../constants';
import { HeartbeatIcon, ClipboardListIcon, LightbulbIcon, CheckCircleIcon, StethoscopeIcon, NutritionIcon, PdfIcon } from './IconComponents';
import { generatePatientReportPDF } from '../services/pdfGenerator';

interface PatientReportProps {
  summary: PatientSummary;
  language: Language;
}

const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <div className="text-slate-600 dark:text-slate-300 space-y-2">
            {children}
        </div>
    </div>
);

const PatientReport: React.FC<PatientReportProps> = ({ summary, language }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const t = translations[language].patientReport;
  const t_doctor = translations[language].doctorReport; // For button text consistency
  const isArabic = language === 'ar';

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    try {
        await generatePatientReportPDF(summary, language);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };


  const renderList = (items: string[]) => (
    <ul className="list-none space-y-3">
        {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 mt-1">
                  <CheckCircleIcon />
                </div>
                <span>{item}</span>
            </li>
        ))}
    </ul>
  );

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
            <button
                onClick={handleExportPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80 rounded-lg disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
                {isGeneratingPdf ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t_doctor.exportingPdf}
                    </>
                ) : (
                    <>
                        <PdfIcon />
                        {t_doctor.exportPdf}
                    </>
                )}
            </button>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
         <ReportCard title={t.overallImpression} icon={<HeartbeatIcon />}>
            <p>{isArabic ? summary.overallImpression_ar : summary.overallImpression_en}</p>
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard title={t.keyFindings} icon={<ClipboardListIcon />}>
            {renderList(isArabic ? summary.keyFindings_ar : summary.keyFindings_en)}
        </ReportCard>

        <ReportCard title={t.recommendations} icon={<LightbulbIcon />}>
             {renderList(isArabic ? summary.recommendations_ar : summary.recommendations_en)}
        </ReportCard>

        <ReportCard title={t.medicalAdvice} icon={<StethoscopeIcon />}>
             {renderList(isArabic ? summary.medicalAdvice_ar : summary.medicalAdvice_en)}
        </ReportCard>

        <ReportCard title={t.nutritionalAdvice} icon={<NutritionIcon />}>
             {renderList(isArabic ? summary.nutritionalAdvice_ar : summary.nutritionalAdvice_en)}
        </ReportCard>
      </div>
    </div>
  );
};

export default PatientReport;