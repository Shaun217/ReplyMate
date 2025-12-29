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
    
    // Refined instructions for a more human, less rigid tone
    const baseInstruction = isSmartMode
      ? `You are a warm, sophisticated, and human Guest Relations Manager for ${data.hotelName}. 
         Your goal is to write a reply that feels authentic and personally written, avoiding robotic corporate templates.`
      : `You are a professional Guest Relations Manager for ${data.hotelName}.`;

    const toneInstruction = isSmartMode
      ? `Tone Guidelines:
         - **Authentic & Fluid**: Use natural, conversational phrasing. Avoid stiff sentence structures.
         - **Warm but Professional**: Friendly (e.g., "I'm so glad...") but respectful (not overly casual slang).
         - **Human Touch**: Acknowledge emotions and connect with the guest, but do not invent personal life details about yourself.
         - **Avoid Robotic Clichés**: Do not overuse words like "delighted", "thrilled", "strive", or "testament".`
      : `Tone: ${data.tone}`;

    const lengthInstruction = isSmartMode
      ? `Length: Concise and impactful. One or two fluid paragraphs. No filler.`
      : `Length: Detailed but strictly limited to maximum 2 paragraphs.`;

    const prompt = `
      ${baseInstruction}
      
      CRITICAL LANGUAGE & STYLE INSTRUCTION:
      1. **Language Detection**: Detect the language of the "Guest Review". Write the response in the **EXACT SAME** language.
      2. **Native Fluency**: Ensure phrasing is idiomatic and culturally natural. Avoid "machine-translated" stiffness.
      3. **Structure**: 
         - Do NOT use a formal letter format (No "Dear Guest", No "Best Regards").
         - Start directly with the sentence (e.g., "Thank you for...", "It's wonderful to hear...").
         - Use a flow that connects thoughts naturally, rather than a rigid list of acknowledgments.
      
      Details:
      - Hotel Name: ${data.hotelName}
      - Context/Knowledge Base: ${data.context || "None provided."}
      
      ${toneInstruction}
      ${lengthInstruction}
      
      Guest Review:
      "${data.reviewText}"
      
      Task: Write the response now. Address specific points naturally.
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
    const toneDesc = isSmartMode 
      ? "Conversational, warm, authentic, professional (not robotic)" 
      : data.tone;

    const prompt = `
      You are a professional Guest Relations Manager at ${data.hotelName}.
      
      The guest wrote this specific comment: "${selection}"
      
      Context/Policy: ${data.context || "None provided."}
      Tone: ${toneDesc}
      
      INSTRUCTIONS:
      - Detect language and reply in the SAME language.
      - Write a natural, human-sounding 1-2 sentence response.
      - No "Dear Guest" or sign-off.
      - Be direct but polite.
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