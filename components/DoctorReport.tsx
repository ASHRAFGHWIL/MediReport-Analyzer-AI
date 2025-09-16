import React, { useState } from 'react';
import type { DoctorReport as DoctorReportType, ResultItem, Language, PdfExportOptions } from '../types';
import { translations } from '../constants';
import { generateDoctorReportPDF } from '../services/pdfGenerator';
import { PdfIcon, ClipboardIcon, CheckCircleIcon } from './IconComponents';
import PdfExportModal from './PdfExportModal';

interface DoctorReportProps {
  report: DoctorReportType;
  language: Language;
  fileName: string;
}

const statusColorMap: { [key in ResultItem['status']]: string } = {
  Normal: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Borderline: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  Critical: 'bg-red-200 text-red-900 dark:bg-red-800/60 dark:text-red-200 font-bold',
};

const DoctorReport: React.FC<DoctorReportProps> = ({ report, language, fileName }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const t = translations[language].doctorReport;
  const isArabic = language === 'ar';
  const statusTooltips = t.statusTooltips;

  const handleExportPdf = async (options: PdfExportOptions) => {
    setIsGeneratingPdf(true);
    setIsPdfModalOpen(false);
    try {
        await generateDoctorReportPDF(report, language, options);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };
  
  const handleCopyToClipboard = async () => {
    const isArabic = language === 'ar';
    
    let textToCopy = `${t.title}\n\n`;
    
    textToCopy += `--- ${t.professionalSummary} ---\n`;
    textToCopy += `${isArabic ? report.summary_ar : report.summary_en}\n\n`;
    
    textToCopy += `--- ${t.detailedResults} ---\n`;
    
    // Table header
    const headers = [
      t.testName,
      t.value,
      t.unit,
      t.referenceRange,
      t.status,
      t.interpretation,
      t.possibleCauses
    ].join('\t');
    textToCopy += headers + '\n';
    
    // Table body
    const body = report.results.map(item => [
      item.testName,
      item.value,
      item.unit,
      item.referenceRange,
      item.status,
      isArabic ? item.interpretation_ar : item.interpretation_en,
      isArabic ? item.possibleCauses_ar : item.possibleCauses_en
    ].join('\t')).join('\n');
    textToCopy += body;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text to clipboard.');
    }
  };

  const rawFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  const defaultPdfName = `Doctor_Report_${rawFileName}_${new Date().toISOString().split('T')[0]}`;

  return (
    <>
        <PdfExportModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            onExport={handleExportPdf}
            reportType="doctor"
            defaultFileName={defaultPdfName}
            language={language}
        />
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyToClipboard}
                        disabled={isCopied}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isCopied ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5 text-green-500"/>
                                <span>{t.copied}</span>
                            </>
                        ) : (
                            <>
                                <ClipboardIcon className="w-5 h-5"/>
                                <span>{t.copyToClipboard}</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setIsPdfModalOpen(true)}
                        disabled={isGeneratingPdf}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80 rounded-lg disabled:opacity-50 disabled:cursor-wait transition-colors"
                    >
                        {isGeneratingPdf ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.exportingPdf}
                            </>
                        ) : (
                            <>
                                <PdfIcon />
                                {t.exportPdf}
                            </>
                        )}
                    </button>
                </div>
            </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t.professionalSummary}</h3>
            <p className="text-slate-600 dark:text-slate-300">{isArabic ? report.summary_ar : report.summary_en}</p>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">{t.detailedResults}</h3>
            <div className="overflow-auto max-h-[60vh] rounded-lg border border-slate-200 dark:border-slate-700 relative">
            <table className="min-w-full divide-y-2 divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-700 text-start">
                <tr>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.testName}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.value}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.unit}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.referenceRange}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.status}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.interpretation}</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-200 text-start">{t.possibleCauses}</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {report.results.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-800 dark:even:bg-slate-800/50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{item.testName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">{item.value}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">{item.unit}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">{item.referenceRange}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                        <div className="relative group flex items-center">
                            <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs ${statusColorMap[item.status] || 'bg-slate-100 text-slate-800'}`}>
                            {item.status}
                            </span>
                            <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-900 rounded-md shadow-lg invisible group-hover:visible transition-opacity opacity-0 group-hover:opacity-100 z-20">
                                {statusTooltips[item.status as keyof typeof statusTooltips]}
                                <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                            </div>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 min-w-[20rem]">{isArabic ? item.interpretation_ar : item.interpretation_en}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 min-w-[20rem]">{isArabic ? item.possibleCauses_ar : item.possibleCauses_en}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </>
  );
};

export default DoctorReport;