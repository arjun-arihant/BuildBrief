import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getSystemPrompt } from './prompts';
import { AIResponse, ProjectState } from './types';

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    console.warn("WARNING: OPENROUTER_API_KEY is not set. API calls will fail.");
}

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: API_KEY || 'MISSING_KEY',
    defaultHeaders: {
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'BuildBrief'
    }
});

const MODEL = 'xiaomi/mimo-v2-flash';

export async function getNextStep(state: ProjectState, lastAnswer: string): Promise<AIResponse> {
    try {
        const prompt = getSystemPrompt(JSON.stringify(state, null, 2), lastAnswer);

        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI that responds ONLY in valid JSON format. Do not include any markdown code blocks or other formatting.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' }
        });

        const responseText = completion.choices[0]?.message?.content || '';
        console.log("OpenRouter Raw Response:", responseText);

        let jsonResponse: AIResponse;
        try {
            jsonResponse = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        } catch (e) {
            console.error("Failed to parse JSON", e);
            throw new Error("AI returned invalid JSON");
        }

        return jsonResponse;

    } catch (error) {
        console.error("OpenRouter API Error:", error);
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
