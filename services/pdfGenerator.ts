import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DoctorReport as DoctorReportType, Language, PatientSummary } from '../types';
import { translations } from '../constants';
import { AMIRI_FONT_BASE64 } from '../lib/amiri-font';

export const generateDoctorReportPDF = async (report: DoctorReportType, language: Language) => {
    const doc = new jsPDF();
    const t = translations[language].doctorReport;
    const isArabic = language === 'ar';

    // Add Amiri font for Arabic support
    doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    // Set font based on language
    const setDocFont = (style: 'normal' | 'bold' = 'normal') => {
        doc.setFont(isArabic ? 'Amiri' : 'Helvetica', style);
    };

    const pageMargin = 15;

    setDocFont('bold');
    doc.setFontSize(20);
    doc.text(t.title, 105, 20, { align: 'center' });

    // --- Professional Summary ---
    setDocFont('bold');
    doc.setFontSize(14);
    const summaryTitleX = isArabic ? doc.internal.pageSize.getWidth() - pageMargin : pageMargin;
    doc.text(t.professionalSummary, summaryTitleX, 40, { align: isArabic ? 'right' : 'left' });

    setDocFont('normal');
    doc.setFontSize(10);
    const summaryText = isArabic ? report.summary_ar : report.summary_en;
    const usableWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    const splitSummary = doc.splitTextToSize(summaryText, usableWidth);
    doc.text(splitSummary, summaryTitleX, 48, { align: isArabic ? 'right' : 'left' });
    
    // Calculate where the table should start
    const summaryHeight = splitSummary.length * (doc.getLineHeight() / doc.internal.scaleFactor);
    const tableStartY = 48 + summaryHeight + 5;

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
        margin: { left: pageMargin, right: pageMargin },
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

    const pageMargin = 15;
    const usableWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    let yPos = 20;
    // Fix: Explicitly type `rtlAlign` to prevent TypeScript from widening `align` to a generic `string`.
    // This ensures compatibility with jsPDF's `TextOptionsLight` type.
    const rtlAlign: { align: 'right' | 'left' } = { align: isArabic ? 'right' : 'left' };
    const textX = isArabic ? doc.internal.pageSize.getWidth() - pageMargin : pageMargin;

    // --- Title ---
    setDocFont('bold');
    doc.setFontSize(20);
    doc.text(patientT.title, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 20;

    // Helper to render a section with title and content
    const renderSection = (title: string, content: string | string[]) => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;

        if (yPos > 260) {
            doc.addPage();
            yPos = 20;
        }

        setDocFont('bold');
        doc.setFontSize(14);
        doc.text(title, textX, yPos, rtlAlign);
        yPos += 8;

        setDocFont('normal');
        doc.setFontSize(10);

        if (Array.isArray(content)) {
            content.forEach(item => {
                const itemText = `• ${item}`;
                const textLines = doc.splitTextToSize(itemText, usableWidth);
                if (yPos + (textLines.length * 5) > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(textLines, textX, yPos, rtlAlign);
                yPos += textLines.length * 5 + 2;
            });
        } else {
            const textLines = doc.splitTextToSize(content, usableWidth);
            if (yPos + (textLines.length * 5) > 280) {
                doc.addPage();
                yPos = 20;
            }
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
    if (yPos > 260) {
        doc.addPage();
        yPos = 20;
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

    doc.save(`MediReport_Patient_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
};
