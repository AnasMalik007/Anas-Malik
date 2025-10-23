
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// FIX: Initialize GoogleGenAI client directly with the environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    documentType: {
      type: Type.STRING,
      description: "Classify the document into one of the following categories: 'Lab Report', 'Prescription', 'Medicine Label', or 'Other Medical Document'.",
    },
    documentSummary: {
      type: Type.STRING,
      description: "A brief, one-paragraph summary of the provided document's content and purpose.",
    },
    labResults: {
      type: Type.ARRAY,
      description: "An array of all identified lab results. Omit if not a lab report.",
      items: {
        type: Type.OBJECT,
        properties: {
          testName: { type: Type.STRING, description: "The name of the lab test." },
          value: { type: Type.STRING, description: "The patient's result for the test." },
          referenceRange: { type: Type.STRING, description: "The normal or reference range for the test." },
          interpretation: { type: Type.STRING, description: "A simple explanation of what the result means (e.g., 'Normal', 'High', 'Low')." },
        },
        required: ["testName", "value", "referenceRange", "interpretation"],
      },
    },
    medications: {
      type: Type.ARRAY,
      description: "An array of all identified medications. Omit if no medications are listed.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the medication." },
          dosage: { type: Type.STRING, description: "The prescribed dosage (e.g., '500mg, twice daily')." },
          purpose: { type: Type.STRING, description: "The reason or condition this medication is prescribed for." },
        },
        required: ["name", "dosage", "purpose"],
      },
    },
    potentialDiagnosis: {
      type: Type.OBJECT,
      description: "The most likely diagnosis based on the provided document.",
      properties: {
        condition: { type: Type.STRING, description: "The name of the potential condition or diagnosis." },
        reasoning: { type: Type.STRING, description: "A detailed explanation of how the document's information supports this diagnosis." },
        confidenceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating confidence in this diagnosis." },
      },
      required: ["condition", "reasoning", "confidenceScore"],
    },
    recommendations: {
        type: Type.ARRAY,
        description: "A list of general, non-prescriptive next steps or recommendations.",
        items: {
            type: Type.STRING,
        }
    }
  },
  required: ["documentType", "documentSummary", "potentialDiagnosis", "recommendations"],
};

export async function analyzeMedicalDocument(
  base64Image: string,
  mimeType: string,
  userPrompt: string
): Promise<AnalysisResult> {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Analyze the following medical document. ${userPrompt ? `User's specific question: "${userPrompt}"` : ''}`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "You are an expert AI medical document analyst. Your task is to interpret the provided image of a medical document (lab report, prescription, etc.) and return a structured JSON analysis. First, classify the document type. Then, be objective, precise, and extract all relevant information. Provide a potential diagnosis based ONLY on the evidence in the document. Conclude with general recommendations. Crucially, your entire response must strictly adhere to the provided JSON schema.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing document with Gemini:", error);
     if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("API Key is invalid. Please ensure it is configured correctly.");
        }
        if (error.message.toLowerCase().includes('network')) {
             throw new Error("Network error. Please check your internet connection and try again.");
        }
    }
    // Generic fallback for other AI-related errors (e.g., content filtering, unreadable image)
    throw new Error("AI analysis failed. The document might be blurry, unreadable, or not a valid medical document. Please try again with a clearer image.");
  }
}
