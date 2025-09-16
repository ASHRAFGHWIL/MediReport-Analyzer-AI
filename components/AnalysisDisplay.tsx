import React, { useState } from 'react';
import type { AnalysisResult, Language } from '../types';
import PatientReport from './PatientReport';
import DoctorReport from './DoctorReport';
import { translations } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface AnalysisDisplayProps {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  language: Language;
}

type ActiveTab = 'patient' | 'doctor';

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ isLoading, analysisResult, language }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('patient');
  const t = translations[language];

  if (isLoading) {
    return <LoadingSpinner language={language} />;
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('patient')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'patient'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {t.patientView}
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'doctor'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {t.doctorView}
          </button>
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'patient' && <PatientReport summary={analysisResult.patientSummary} language={language} />}
        {activeTab === 'doctor' && <DoctorReport report={analysisResult.doctorReport} language={language} />}
      </div>
    </div>
  );
};

export default AnalysisDisplay;