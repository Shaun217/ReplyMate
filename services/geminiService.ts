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
    
    // Customized prompt logic based on high-quality examples
    // The user wants a "Senior General Manager" tone: detailed, solution-oriented, sincere.
    
    const baseInstruction = `You are the Senior General Manager of ${data.hotelName}. 
    Your goal is to write a reply that demonstrates "High-Touch Hospitality". 
    Your tone should be: **Dignified, Sincere, Solution-Oriented, and Warmly Professional** (不卑不亢，真诚专业).`;

    const styleGuide = `
      STYLE & STRUCTURE RULES (Strictly Follow):
      1.  **Salutation**: Use a formal but warm greeting (e.g., "尊敬的宾客" or "Dear Guest").
      2.  **The "Hook"**: Start by thanking them specifically for choosing ${data.hotelName}.
      3.  **Addressing Negatives (The "Action Plan" Approach)**:
          - Do NOT just apologize. You MUST mention specific actions.
          - Example: If they complain about cleaning, say "The Housekeeping Manager has reviewed our cleaning protocols."
          - Example: If they complain about hardware, say "The Engineering Team has been notified to inspect [item]."
          - If it is a policy issue (e.g., fees, room type), explain it clearly but gently (Transparency).
      4.  **Addressing Positives**:
          - Validate specific details they liked (e.g., "We are glad you enjoyed the coffee serves by Nora").
          - Elevate it to the brand's mission (e.g., "This reflects our commitment to hospitality").
      5.  **The "Future Offer" Closing**:
          - Do NOT end generically. Offer a specific path for their next stay.
          - Example: "Please contact us in advance next time, and we will pre-allocate a room with a better view/quiet location for you."
    `;

    // Dynamic tone adjustment based on user selection, but anchoring to the "Manager" persona
    const toneInstruction = data.tone === 'Smart' 
      ? `Tone Adjustment: Authentic, fluid, sophisticated. Avoid robotic "AI" phrases.`
      : `Tone Adjustment: ${data.tone}`;

    const prompt = `
      ${baseInstruction}
      
      ${styleGuide}
      
      CRITICAL INSTRUCTIONS:
      - **Language Detection**: Detect the language of the "Guest Review" and reply in the **EXACT SAME LANGUAGE**. (If review is Chinese, reply in high-quality native Chinese).
      - **Context Integration**: Use the provided context delicately. Don't just copy-paste it; weave it into the explanation.
      
      Details:
      - Hotel Name: ${data.hotelName}
      - Context/Knowledge Base: ${data.context || "None provided."}
      
      ${toneInstruction}
      
      Guest Review:
      "${data.reviewText}"
      
      Task: Write the response now. Follow the structure: Greeting -> Gratitude -> Specific Rebuttal/Validation (Action Oriented) -> Future Offer/Closing.
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
      You are the General Manager of ${data.hotelName}.
      
      The guest wrote this specific comment: "${selection}"
      
      Context/Policy: ${data.context || "None provided."}
      
      INSTRUCTIONS:
      - Detect language and reply in the SAME language.
      - Provide a specific, solution-oriented response (1-2 sentences).
      - If it's a complaint, mention a specific department (Housekeeping/Engineering) taking action.
      - If it's a compliment, thank them warmly.
      - Tone: Professional, Sincere, Dignified.
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