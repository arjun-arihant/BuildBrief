import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getSystemPrompt, getTaskBreakdownPrompt } from './prompts';
import { AIResponse, ProjectState } from './types';
import { logger } from './logger';

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    logger.warn("OPENROUTER_API_KEY is not set. API calls will fail.");
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

export async function getNextStep(state: ProjectState, lastAnswer: string, existingContext?: string): Promise<AIResponse> {
    try {
        const prompt = getSystemPrompt(JSON.stringify(state, null, 2), lastAnswer, existingContext);

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
        logger.debug("OpenRouter Raw Response", { responseText });

        let jsonResponse: AIResponse;
        try {
            jsonResponse = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        } catch (e) {
            logger.error("Failed to parse JSON", e as Error);
            throw new Error("AI returned invalid JSON");
        }

        return jsonResponse;

    } catch (error) {
        logger.error("OpenRouter API Error", error as Error);
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

export async function getTaskBreakdown(megaPrompt: string, projectName: string): Promise<Record<string, unknown>> {
    try {
        const prompt = getTaskBreakdownPrompt(megaPrompt, projectName);

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
        logger.debug("Task Breakdown Raw Response", { responseText });

        const parsed = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        return parsed;
    } catch (error) {
        logger.error("Task Breakdown Error", error as Error);
        throw new Error("Failed to generate task breakdown");
    }
}
