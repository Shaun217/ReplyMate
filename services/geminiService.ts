import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ReviewData } from '../types';

const getClient = () => {
  // API key must be strictly obtained from environment variables as per guidelines
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const streamReply = async (
  data: ReviewData,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const ai = getClient();
    
    // Customized prompt logic for "Smart" mode vs others
    const isSmartMode = data.tone === 'Smart';
    
    const baseInstruction = isSmartMode
      ? `You are an enthusiastic and professional Guest Relations Manager for ${data.hotelName}. 
         Your task is to write a reply suitable for a website comment section.`
      : `You are a professional Guest Relations Manager for ${data.hotelName}.`;

    const toneInstruction = isSmartMode
      ? `Tone requirements: Enthusiastic, warm, sincere, professional. 
         - Express genuine gratitude.
         - Include warm greetings and blessings.
         - Enthusiastically welcome them to visit again.`
      : `Tone: ${data.tone}`;

    const lengthInstruction = isSmartMode
      ? `Length: Concise. Single paragraph preferred.`
      : `Length: Detailed but strictly limited to maximum 2 paragraphs.`;

    const prompt = `
      ${baseInstruction}
      
      CRITICAL LANGUAGE INSTRUCTION:
      1. Detect the language of the "Guest Review" below.
      2. Write your response in the EXACT SAME language.
      3. Ensure the phrasing is NATIVE-LEVEL, idiomatic, and culturally appropriate.
      4. Avoid robotic or "machine-translated" phrasing.
      5. If the context/facts provided are in a different language, translate the facts naturally into the response language.
      
      FORMAT REQUIREMENTS (STRICT):
      - Do NOT use a letter format.
      - Do NOT use a formal salutation on a separate line (e.g. "Dear Guest,"). Start directly with the text.
      - Do NOT use a sign-off or signature at the end (e.g. "Best regards, Name").
      - Output as a single continuous paragraph, or maximum 2 paragraphs for complex reviews.
      
      Details:
      - Hotel Name: ${data.hotelName}
      - Context/Knowledge Base: ${data.context || "None provided."}
      
      ${toneInstruction}
      ${lengthInstruction}
      
      Guest Review:
      "${data.reviewText}"
      
      Task: Write the response now. Address specific points mentioned by the guest.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    for await (const chunk of response) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Gemini stream error:", error);
    onChunk("\n[Error generating response. Please check API Key and try again.]");
  }
};

export const generateSelectionReply = async (
  selection: string,
  data: ReviewData
): Promise<string> => {
  try {
    const ai = getClient();
    const isSmartMode = data.tone === 'Smart';
    const toneDesc = isSmartMode ? "Enthusiastic, warm, sincere, professional" : data.tone;

    const prompt = `
      You are a professional Guest Relations Manager at ${data.hotelName}.
      
      The guest wrote this specific comment in their review: "${selection}"
      
      Context/Policy: ${data.context || "None provided."}
      Tone: ${toneDesc}
      
      CRITICAL LANGUAGE INSTRUCTION:
      - Detect the language of the guest comment.
      - Write the response in the EXACT SAME language.
      - Ensure the wording is natural, polite, and idiomatic for that language.
      
      FORMAT:
      - Single short paragraph or sentence.
      - NO sign-off (Best regards, etc).
      
      Task: Write a 1-2 sentence direct response to this specific point. Keep it warm and polite.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini selection error:", error);
    return "[Error generating selection reply]";
  }
};