import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DoctorReport as DoctorReportType, Language, PatientSummary } from '../types';
import { translations } from '../constants';
import { AMIRI_FONT_BASE64 } from '../lib/amiri-font';

// Base64 encoded PNG logo for MediScan AI. A stylized medical cross within a rounded square.
const APP_LOGO_BASE64 = 'data:image/png;base64,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';

const pageMargin = 15;
const headerHeight = 30; // Increased space for header
const footerHeight = 20;

// Reusable function to add header and footer to all pages of a document
const addHeaderFooter = (doc: jsPDF, language: Language, title: string) => {
    // Fix: The `getNumberOfPages` method is a member of the `jsPDF` instance, not `doc.internal`.
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const isArabic = language === 'ar';
    
    const setDocFont = (style: 'normal' | 'bold' = 'normal', size: number = 10) => {
        doc.setFont(isArabic ? 'Amiri' : 'Helvetica', style);
        doc.setFontSize(size);
    };

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // -- HEADER --
        doc.addImage(APP_LOGO_BASE64, 'PNG', pageMargin, 8, 14, 14);
        
        setDocFont('bold', 16);
        doc.setTextColor(40);
        const appName = translations[language].appName;
        doc.text(appName, pageWidth / 2, 15, { align: 'center' });
        
        setDocFont('normal', 10);
        doc.setTextColor(100);
        doc.text(title, pageWidth / 2, 22, { align: 'center' });

        doc.setDrawColor(220); 
        doc.setLineWidth(0.2);
        doc.line(pageMargin, headerHeight - 5, pageWidth - pageMargin, headerHeight - 5);

        // -- FOOTER --
        doc.line(pageMargin, pageHeight - footerHeight, pageWidth - pageMargin, pageHeight - footerHeight);
        
        setDocFont('normal', 8);
        doc.setTextColor(150);
        
        const generatorText = `Generated by ${translations.en.appName}`;
        doc.text(generatorText, pageMargin, pageHeight - 10, { align: 'left' });

        const pageNumText = `Page ${i} of ${pageCount}`;
        doc.text(pageNumText, pageWidth - pageMargin, pageHeight - 10, { align: 'right' });
    }
};

export const generateDoctorReportPDF = async (report: DoctorReportType, language: Language) => {
    const doc = new jsPDF();
    const t = translations[language].doctorReport;
    const isArabic = language === 'ar';

    // Add Amiri font for Arabic support
    doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    const setDocFont = (style: 'normal' | 'bold' = 'normal') => {
        doc.setFont(isArabic ? 'Amiri' : 'Helvetica', style);
    };

    let yPos = headerHeight;

    // --- Professional Summary ---
    setDocFont('bold');
    doc.setFontSize(14);
    const summaryTitleX = isArabic ? doc.internal.pageSize.getWidth() - pageMargin : pageMargin;
    doc.text(t.professionalSummary, summaryTitleX, yPos, { align: isArabic ? 'right' : 'left' });
    yPos += 8;

    setDocFont('normal');
    doc.setFontSize(10);
    const summaryText = isArabic ? report.summary_ar : report.summary_en;
    const usableWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    const splitSummary = doc.splitTextToSize(summaryText, usableWidth);
    doc.text(splitSummary, summaryTitleX, yPos, { align: isArabic ? 'right' : 'left' });
    
    // Calculate where the table should start
    const summaryHeight = splitSummary.length * (doc.getLineHeight() / doc.internal.scaleFactor);
    const tableStartY = yPos + summaryHeight + 5;

    // --- Detailed Results Table ---
    const tableHeaders = [
        t.testName,
        t.value,
        t.unit,
        t.referenceRange,
        t.status,
        t.interpretation,
        t.possibleCauses
    ];

    const tableBody = report.results.map(item => [
        item.testName,
        item.value,
        item.unit,
        item.referenceRange,
        item.status,
        isArabic ? item.interpretation_ar : item.interpretation_en,
        isArabic ? item.possibleCauses_ar : item.possibleCauses_en
    ]);

    autoTable(doc, {
        head: [tableHeaders],
        body: tableBody,
        startY: tableStartY,
        margin: { left: pageMargin, right: pageMargin, top: headerHeight },
        styles: {
            font: isArabic ? 'Amiri' : 'Helvetica',
            fontStyle: 'normal',
            halign: isArabic ? 'right' : 'left',
            valign: 'middle', // Vertically center content for better appearance in tall rows
            cellPadding: 3, // Increased padding for better readability
        },
        headStyles: {
            font: isArabic ? 'Amiri' : 'Helvetica',
            fontStyle: 'bold',
            fillColor: [41, 128, 185],
            textColor: 255,
            halign: 'center',
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        columnStyles: {
            0: { cellWidth: 35 }, // Test Name
            1: { cellWidth: 15 }, // Value
            2: { cellWidth: 15 }, // Unit
            3: { cellWidth: 25 }, // Reference Range
            4: { cellWidth: 20 }, // Status
            // Let Interpretation (5) and Possible Causes (6) take up the remaining space
            5: { cellWidth: 'auto' },
            6: { cellWidth: 'auto' },
        }
    });

    addHeaderFooter(doc, language, t.title);
    doc.save(`MediReport_Doctor_View_${new Date().toISOString().split('T')[0]}.pdf`);
};


export const generatePatientReportPDF = async (summary: PatientSummary, language: Language) => {
    const doc = new jsPDF();
    const t = translations[language];
    const patientT = t.patientReport;
    const isArabic = language === 'ar';

    // Add Amiri font for Arabic support
    doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    const setDocFont = (style: 'normal' | 'bold' = 'normal') => {
        doc.setFont(isArabic ? 'Amiri' : 'Helvetica', style);
    };
    
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    let yPos = headerHeight;
    // Fix: Explicitly type `rtlAlign` to prevent TypeScript from widening `align` to a generic `string`.
    // This ensures compatibility with jsPDF's `TextOptionsLight` type.
    const rtlAlign: { align: 'right' | 'left' } = { align: isArabic ? 'right' : 'left' };
    const textX = isArabic ? doc.internal.pageSize.getWidth() - pageMargin : pageMargin;

    // Helper to render a section with title and content
    const renderSection = (title: string, content: string | string[]) => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;

        // Check if a page break is needed before rendering the section title
        if (yPos > pageHeight - footerHeight - 30) {
            doc.addPage();
            yPos = headerHeight;
        }

        setDocFont('bold');
        doc.setFontSize(14);
        doc.text(title, textX, yPos, rtlAlign);
        yPos += 8;

        setDocFont('normal');
        doc.setFontSize(10);
        
        const checkAndAddPage = (requiredHeight: number) => {
            if (yPos + requiredHeight > pageHeight - footerHeight - 10) {
                doc.addPage();
                yPos = headerHeight;
            }
        };

        if (Array.isArray(content)) {
            content.forEach(item => {
                const itemText = `• ${item}`;
                const textLines = doc.splitTextToSize(itemText, usableWidth);
                checkAndAddPage(textLines.length * 5 + 2);
                doc.text(textLines, textX, yPos, rtlAlign);
                yPos += textLines.length * 5 + 2;
            });
        } else {
            const textLines = doc.splitTextToSize(content, usableWidth);
            checkAndAddPage(textLines.length * 5);
            doc.text(textLines, textX, yPos, rtlAlign);
            yPos += textLines.length * 5;
        }
        yPos += 10;
    };

    renderSection(patientT.overallImpression, isArabic ? summary.overallImpression_ar : summary.overallImpression_en);
    renderSection(patientT.keyFindings, isArabic ? summary.keyFindings_ar : summary.keyFindings_en);
    renderSection(patientT.recommendations, isArabic ? summary.recommendations_ar : summary.recommendations_en);
    renderSection(patientT.medicalAdvice, isArabic ? summary.medicalAdvice_ar : summary.medicalAdvice_en);
    renderSection(patientT.nutritionalAdvice, isArabic ? summary.nutritionalAdvice_ar : summary.nutritionalAdvice_en);
    
    // --- Add Disclaimer ---
    if (yPos > pageHeight - footerHeight - 30) {
        doc.addPage();
        yPos = headerHeight;
    }
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(pageMargin, yPos, doc.internal.pageSize.getWidth() - pageMargin, yPos);
    yPos += 10;
    
    setDocFont('bold');
    doc.setFontSize(10);
    doc.text(t.disclaimerTitle, textX, yPos, rtlAlign);
    yPos += 6;

    setDocFont('normal');
    doc.setFontSize(8);
    const disclaimerLines = doc.splitTextToSize(t.disclaimerContent, usableWidth);
    doc.text(disclaimerLines, textX, yPos, rtlAlign);

    addHeaderFooter(doc, language, patientT.title);
    doc.save(`MediReport_Patient_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
};