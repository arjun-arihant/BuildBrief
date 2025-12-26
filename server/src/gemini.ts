import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { getSystemPrompt } from './prompts';
import { AIResponse, ProjectState } from './types';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set. Creating dummy wrapper for testing (will fail if real AI needed).");
}

const genAI = new GoogleGenerativeAI(API_KEY || 'MISSING_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // STRICT: User requested gemini-3-flash-preview

export async function getNextStep(state: ProjectState, lastAnswer: string): Promise<AIResponse> {
    try {
        const prompt = getSystemPrompt(JSON.stringify(state, null, 2), lastAnswer);

        // In valid production, we might want generationConfig with responseMimeType: 'application/json'
        // but simple prompting works well too.
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const responseText = result.response.text();
        console.log("Gemini Raw Response:", responseText); // Debugging

        let jsonResponse: AIResponse;
        try {
            jsonResponse = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        } catch (e) {
            console.error("Failed to parse JSON", e);
            throw new Error("AI returned invalid JSON");
        }

        return jsonResponse;

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback error response
        return {
            type: "error",
            template: "explanation_only",
            content: {
                question_text: "System Error",
                explanation: "The AI service is currently unavailable or encountered an error. Please try again."
            }
        };
    }
}
