export interface FactCheck {
  claim: string;
  verdict: 'True' | 'False' | 'Misleading' | 'Unverified';
  explanation: string;
  sources: string[];
}

export interface AnalysisResult {
  credibilityScore: number; // 0-100
  summary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  bias: {
    partisan: number; // 0-100
    emotional: number; // 0-100
    clickbait: number; // 0-100
  };
  factChecks: FactCheck[];
  sourceCredibility: {
    score: number;
    flags: string[];
  };
}
