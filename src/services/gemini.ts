import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeContent(content: string, isImage: boolean = false): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = isImage 
    ? "Analyze this image for potential misinformation, deepfake signs, and context. Provide a detailed fact-check."
    : `Analyze the following content for credibility, bias, and fact-check any claims. 
       Content: ${content}`;

  const response = await ai.models.generateContent({
    model,
    contents: isImage 
      ? [{ parts: [{ text: prompt }, { inlineData: { data: content, mimeType: "image/jpeg" } }] }]
      : [{ parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          credibilityScore: { type: Type.NUMBER, description: "Overall credibility score from 0 to 100" },
          summary: { type: Type.STRING, description: "Brief summary of the analysis" },
          sentiment: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER }
            },
            required: ["positive", "neutral", "negative"]
          },
          bias: {
            type: Type.OBJECT,
            properties: {
              partisan: { type: Type.NUMBER, description: "Partisan bias score 0-100" },
              emotional: { type: Type.NUMBER, description: "Emotional intensity score 0-100" },
              clickbait: { type: Type.NUMBER, description: "Clickbait likelihood score 0-100" }
            },
            required: ["partisan", "emotional", "clickbait"]
          },
          factChecks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING },
                verdict: { type: Type.STRING, enum: ["True", "False", "Misleading", "Unverified"] },
                explanation: { type: Type.STRING },
                sources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["claim", "verdict", "explanation", "sources"]
            }
          },
          sourceCredibility: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              flags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "flags"]
          }
        },
        required: ["credibilityScore", "summary", "sentiment", "bias", "factChecks", "sourceCredibility"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
