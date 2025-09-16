export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg';

export interface ResultItem {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline' | 'Critical';
  interpretation_en: string;
  interpretation_ar: string;
  possibleCauses_en: string;
  possibleCauses_ar: string;
}

export interface PatientSummary {
  overallImpression_en: string;
  overallImpression_ar: string;
  keyFindings_en: string[];
  keyFindings_ar: string[];
  recommendations_en: string[];
  recommendations_ar: string[];
  medicalAdvice_en: string[];
  medicalAdvice_ar: string[];
  nutritionalAdvice_en: string[];
  nutritionalAdvice_ar: string[];
}

export interface DoctorReport {
  summary_en: string;
  summary_ar: string;
  // Fix: Corrected typo from Resultitem to ResultItem.
  results: ResultItem[];
}

export interface AnalysisResult {
  patientSummary: PatientSummary;
  doctorReport: DoctorReport;
}

export interface HistoryItem {
  analysis: AnalysisResult;
  timestamp: string;
  fileName: string;
}