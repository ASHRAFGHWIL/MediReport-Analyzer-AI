import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { GEMINI_MODEL } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    patientSummary: {
      type: Type.OBJECT,
      properties: {
        overallImpression_en: { type: Type.STRING, description: "A brief, easy-to-understand overall impression of the results for the patient in English." },
        overallImpression_ar: { type: Type.STRING, description: "A brief, easy-to-understand overall impression of the results for the patient in Arabic." },
        keyFindings_en: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A list of the most important findings (abnormal or notable results) in simple terms for the patient in English."
        },
        keyFindings_ar: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A list of the most important findings (abnormal or notable results) in simple terms for the patient in Arabic."
        },
        recommendations_en: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A list of general, non-prescriptive recommendations (e.g., 'Consult a specialist') for the patient in English. Must include a disclaimer to consult a doctor."
        },
        recommendations_ar: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of general, non-prescriptive recommendations (e.g., 'Consult a specialist') for the patient in Arabic. Must include a disclaimer to consult a doctor."
        },
        medicalAdvice_en: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of actionable, general medical advice points based on the findings, in English. Framed as general knowledge, not a direct command."
        },
        medicalAdvice_ar: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of actionable, general medical advice points based on the findings, in Arabic. Framed as general knowledge, not a direct command."
        },
        nutritionalAdvice_en: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific nutritional and dietary advice based on the lab results, in English."
        },
        nutritionalAdvice_ar: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific nutritional and dietary advice based on the lab results, in Arabic."
        },
      },
       required: ["overallImpression_en", "overallImpression_ar", "keyFindings_en", "keyFindings_ar", "recommendations_en", "recommendations_ar", "medicalAdvice_en", "medicalAdvice_ar", "nutritionalAdvice_en", "nutritionalAdvice_ar"],
    },
    doctorReport: {
      type: Type.OBJECT,
      properties: {
        summary_en: { type: Type.STRING, description: "A professional, clinical summary of the findings for a doctor or researcher in English." },
        summary_ar: { type: Type.STRING, description: "A professional, clinical summary of the findings for a doctor or researcher in Arabic." },
        results: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              testName: { type: Type.STRING, description: "The name of the lab test (e.g., 'Hemoglobin A1c')." },
              value: { type: Type.STRING, description: "The measured value of the test." },
              unit: { type: Type.STRING, description: "The unit of measurement (e.g., 'mg/dL')." },
              referenceRange: { type: Type.STRING, description: "The normal reference range for this test (e.g., '70-100')." },
              status: {
                type: Type.STRING,
                enum: ['Normal', 'High', 'Low', 'Borderline', 'Critical'],
                description: "The status of the result compared to the reference range."
              },
              interpretation_en: { type: Type.STRING, description: "A brief clinical interpretation of this specific result in English." },
              interpretation_ar: { type: Type.STRING, description: "A brief clinical interpretation of this specific result in Arabic." },
              possibleCauses_en: { type: Type.STRING, description: "A brief list of possible clinical causes for an abnormal result, in English." },
              possibleCauses_ar: { type: Type.STRING, description: "A brief list of possible clinical causes for an abnormal result, in Arabic." },
            },
            required: ["testName", "value", "unit", "referenceRange", "status", "interpretation_en", "interpretation_ar", "possibleCauses_en", "possibleCauses_ar"],
          },
        },
      },
      required: ["summary_en", "summary_ar", "results"],
    },
  },
  required: ["patientSummary", "doctorReport"],
};


export const analyzeMedicalReport = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze the attached medical report. Extract all lab tests, their values, units, and reference ranges. Provide a patient-friendly summary (including medical and nutritional advice) and a detailed doctor's report (including possible causes for abnormalities) in both English and Arabic. Adhere strictly to the provided JSON schema.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        // Fix: Moved systemInstruction into the config object as per Gemini API guidelines.
        systemInstruction: "You are a specialized medical AI assistant designed to analyze and interpret lab reports from images. Your output must be a valid JSON object matching the provided schema, containing both patient and professional summaries in English and Arabic.",
      },
    });

    const jsonText = response.text.trim();
    // Sometimes the model might wrap the JSON in markdown, so we strip it.
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    const parsedResult: AnalysisResult = JSON.parse(cleanedJsonText);
    return parsedResult;
  } catch (error) {
    console.error("Error analyzing report with Gemini:", error);
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
};
