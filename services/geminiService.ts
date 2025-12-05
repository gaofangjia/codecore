import { GoogleGenAI } from "@google/genai";
import { CodeLanguage, ProcessMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processCodeWithGemini = async (
  code: string,
  language: CodeLanguage,
  mode: ProcessMode
): Promise<string> => {
  if (!code.trim()) return "";

  const isObfuscate = mode === ProcessMode.OBFUSCATE;
  
  // Choose model based on task complexity. 
  // Code manipulation is generally handled well by the 2.5 Flash model which is fast and efficient.
  const modelId = 'gemini-2.5-flash';

  let prompt = "";
  
  if (isObfuscate) {
    prompt = `
      You are an expert code security tool.
      Task: Obfuscate and apply encryption-like techniques to the following ${language} code.
      Requirements:
      1. Make the code difficult for humans to read (variable renaming, logic complication, encoding strings).
      2. Ensure the code remains FUNCTIONALLY IDENTICAL to the original. It must run without errors.
      3. For PHP, use techniques like string encoding or variable indirection.
      4. For Python, use techniques like lambda abuse or base64 encoding with exec (if safe/standard for obfuscation demos).
      5. For JavaScript, use minification, hex encoding, or packer-style techniques.
      6. Return ONLY the raw code text. Do not wrap in markdown code blocks (\`\`\`).
      
      Input Code:
      ${code}
    `;
  } else {
    prompt = `
      You are an expert code analysis and refactoring tool.
      Task: De-obfuscate, decrypt, and refactor the following ${language} code.
      Requirements:
      1. Restore readability (rename variables to meaningful names if possible, fix indentation).
      2. Explain complex logic by simplifying it.
      3. Return ONLY the raw code text. Do not wrap in markdown code blocks (\`\`\`).
      
      Input Code:
      ${code}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster code processing unless very complex
      }
    });

    let result = response.text || "";

    // Cleanup: Remove markdown backticks if Gemini ignores the instruction
    result = result.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
    
    return result.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("星际通讯受阻 (API Request Failed). Please check your connection or API key.");
  }
};