
export type Language = 'en' | 'ar';

export interface ResultItem {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline' | 'Critical';
  interpretation_en: string;
  interpretation_ar: string;
}

export interface PatientSummary {
  overallImpression_en: string;
  overallImpression_ar: string;
  keyFindings_en: string[];
  keyFindings_ar: string[];
  recommendations_en: string[];
  recommendations_ar: string[];
}

export interface DoctorReport {
  summary_en: string;
  summary_ar: string;
  results: ResultItem[];
}

export interface AnalysisResult {
  patientSummary: PatientSummary;
  doctorReport: DoctorReport;
}
   