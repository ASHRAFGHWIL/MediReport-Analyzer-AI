
import React from 'react';
import type { DoctorReport as DoctorReportType, ResultItem, Language } from '../types';
import { translations } from '../constants';

interface DoctorReportProps {
  report: DoctorReportType;
  language: Language;
}

const statusColorMap: { [key in ResultItem['status']]: string } = {
  Normal: 'bg-green-100 text-green-800',
  High: 'bg-red-100 text-red-800',
  Low: 'bg-yellow-100 text-yellow-800',
  Borderline: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-200 text-red-900 font-bold',
};

const DoctorReport: React.FC<DoctorReportProps> = ({ report, language }) => {
  const t = translations[language].doctorReport;
  const isArabic = language === 'ar';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
      
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t.professionalSummary}</h3>
        <p className="text-slate-600">{isArabic ? report.summary_ar : report.summary_en}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{t.detailedResults}</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y-2 divide-slate-200 bg-white text-sm">
            <thead className="bg-slate-100 text-start">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.testName}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.value}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.unit}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.referenceRange}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.status}</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 text-start">{t.interpretation}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.results.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{item.testName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{item.value}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{item.unit}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.referenceRange}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs ${statusColorMap[item.status] || 'bg-slate-100 text-slate-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 min-w-[20rem]">{isArabic ? item.interpretation_ar : item.interpretation_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorReport;
   