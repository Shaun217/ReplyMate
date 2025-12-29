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
    
    // Core Persona: Senior General Manager
    // Tone: Professional, Enthusiastic, Sincere, Meticulous (专业、热情、真诚、细心)
    // Style: Slightly official but warm (略带官方口吻)
    
    const baseInstruction = `You are the Senior General Manager of ${data.hotelName}. 
    Your tone must be **Professional, Enthusiastic, Sincere, and Meticulous**.
    You represent the hotel officially, so use a **slightly official but warm and human tone** (略带官方口吻，但有温度).`;

    const styleGuide = `
      STRICT FORMATTING RULES (Must Follow):
      1. **NO Letter Format**: Do NOT use "Dear Guest", "Hello", "Respected Guest" or "Best Regards/Sincerely".
      2. **NO Sign-off**: Do NOT end with your name or title. Just end the sentence.
      3. **Length**: Strictly limited to **1 to 2 fluid paragraphs**. Be concise but complete.
      4. **Structure**: Start DIRECTLY with the content.

      CONTENT STRATEGY:
      1. **Opening**: Immediately thank them for choosing ${data.hotelName} and sharing feedback.
      2. **Action-Oriented Rebuttal**: 
         - If negative: Do not just apologize. State the **specific department** (Engineering, Housekeeping, Front Desk) actions taken.
         - Example: "We have immediately notified Engineering to inspect the air conditioning."
      3. **Sincere Validation**: 
         - If positive: Acknowledge specific details they liked warmly.
      4. **Forward-Looking Closing**: 
         - Invite them back with a specific gesture (e.g., "Please contact us in advance for a quieter room").
    `;

    // Dynamic tone adjustment
    const toneInstruction = data.tone === 'Smart' 
      ? `Tone Guideline: Intelligent, polished, and attentive. Avoid robotic templates.`
      : `Tone Guideline: ${data.tone}`;

    const prompt = `
      ${baseInstruction}
      
      ${styleGuide}
      
      ${toneInstruction}
      
      CRITICAL INSTRUCTIONS:
      - **Language**: Detect the review language and reply in the **EXACT SAME LANGUAGE**.
      - **Context**: Intepret the following context intelligently: ${data.context || "None provided."}
      
      Guest Review:
      "${data.reviewText}"
      
      Task: Write the response now. 1-2 Paragraphs only. No headers. No greetings.
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
    
    const prompt = `
      Role: General Manager of ${data.hotelName}.
      Task: Write a quick response to a specific point in a guest review.
      
      Guest Comment: "${selection}"
      Context: ${data.context || "None provided."}
      
      CONSTRAINTS:
      - **NO Letter Format**: No "Dear Guest", No Sign-off.
      - **Length**: 1-2 Sentences max.
      - **Tone**: Professional, Sincere, Slightly Official.
      - **Content**: Be specific and solution-oriented.
      - **Language**: Same as guest comment.
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