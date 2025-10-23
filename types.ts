
export interface Medication {
  name: string;
  dosage: string;
  purpose: string;
}

export interface LabResult {
  testName: string;
  value: string;
  referenceRange: string;
  interpretation: string;
}

export interface AnalysisResult {
  documentType: string;
  documentSummary: string;
  labResults?: LabResult[];
  medications?: Medication[];
  potentialDiagnosis: {
    condition: string;
    reasoning: string;
    confidenceScore: number; // 0-1
  };
  recommendations: string[];
}
