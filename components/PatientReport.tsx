
import React from 'react';
import type { PatientSummary, Language } from '../types';
import { translations } from '../constants';
import { HeartbeatIcon, ClipboardListIcon, LightbulbIcon, CheckCircleIcon } from './IconComponents';

interface PatientReportProps {
  summary: PatientSummary;
  language: Language;
}

const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2">
            {children}
        </div>
    </div>
);

const PatientReport: React.FC<PatientReportProps> = ({ summary, language }) => {
  const t = translations[language].patientReport;
  const isArabic = language === 'ar';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <ReportCard title={t.overallImpression} icon={<HeartbeatIcon />}>
                <p>{isArabic ? summary.overallImpression_ar : summary.overallImpression_en}</p>
            </ReportCard>
        </div>

        <ReportCard title={t.keyFindings} icon={<ClipboardListIcon />}>
            <ul className="list-none space-y-3">
                {(isArabic ? summary.keyFindings_ar : summary.keyFindings_en).map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-1">
                          <CheckCircleIcon />
                        </div>
                        <span>{finding}</span>
                    </li>
                ))}
            </ul>
        </ReportCard>

        <ReportCard title={t.recommendations} icon={<LightbulbIcon />}>
            <ul className="list-none space-y-3">
                {(isArabic ? summary.recommendations_ar : summary.recommendations_en).map((rec, index) => (
                     <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-1 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                        </div>
                        <span>{rec}</span>
                    </li>
                ))}
            </ul>
        </ReportCard>
      </div>
    </div>
  );
};

export default PatientReport;
   