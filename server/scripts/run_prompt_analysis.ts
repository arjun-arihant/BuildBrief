/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3000/api';

const PROMPTS = [
    "E-commerce for vintage shoes",
    "Dating app for rescue dogs",
    "AI-powered code editor",
    "Fitness tracker with social component",
    "Crypto wallet & portfolio tracker",
    "Recipe sharing community",
    "Uber for lawn mowing services",
    "ADHD-friendly task manager",
    "VR Language learning app",
    "Second-hand car marketplace",
    "Telemedicine platform for rural areas",
    "Student budgeting app",
    "Warehouse inventory management system",
    "Wedding planning assistant",
    "Real estate listing platform",
    "Browser-based podcast recorder",
    "NFT gallery and marketplace",
    "Meditation app with biofeedback integration",
    "Local artisan marketplace",
    "Corporate travel booking SaaS"
];

interface AnalysisResult {
    prompt: string;
    total_turns: number;
    questions: string[];
    final_output: any;
    agents_md: string | null;
    logs: string[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAnalysis() {
    const results: AnalysisResult[] = [];

    console.log(`🚀 Starting analysis of ${PROMPTS.length} prompts...`);

    for (const [index, prompt] of PROMPTS.entries()) {
        console.log(`\n[${index + 1}/${PROMPTS.length}] Processing: "${prompt}"`);
        const result: AnalysisResult = {
            prompt,
            total_turns: 0,
            questions: [],
            final_output: null,
            agents_md: null,
            logs: []
        };

        try {
            // 1. Init
            const initRes = await fetch(`${API_URL}/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea: prompt })
            });
            const initData = await initRes.json();

            if (initData.error) throw new Error(initData.error);

            let projectId = initData.projectId;
            let currentStep = initData.step;
            let turnCount = 0;

            // 2. Loop
            while (turnCount < 15) {
                turnCount++;
                result.total_turns = turnCount;

                if (currentStep.template === 'final_output') {
                    console.log(`  ✅ Finished in ${turnCount} turns`);
                    result.final_output = currentStep.content;
                    result.agents_md = currentStep.content.agents_md;
                    break;
                }

                if (currentStep.type === 'question') {
                    const qText = currentStep.content.question_text;
                    console.log(`  ❓ Q${turnCount}: ${qText.substring(0, 60)}...`);
                    result.questions.push(qText);
                }

                // Auto-Answer Strategy
                let answer = "Standard implementation preference.";

                if (currentStep.template === 'single_choice' || currentStep.template === 'multi_choice') {
                    if (currentStep.content.options && currentStep.content.options.length > 0) {
                        answer = currentStep.content.options[0].value;
                        console.log(`    👉 Auto-selected: ${answer}`);
                    }
                } else if (currentStep.template === 'manual_action') {
                    answer = "Done";
                }

                // Send Answer
                const ansRes = await fetch(`${API_URL}/answer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, answer })
                });
                const ansData = await ansRes.json();

                if (ansData.error) throw new Error(ansData.error);
                currentStep = ansData.step;

                // Small delay to be nice to API
                await sleep(500);
            }

        } catch (error: any) {
            console.error(`  ❌ Error processing prompt "${prompt}":`, error.message);
            result.logs.push(`Error: ${error.message}`);
        }

        results.push(result);
    }

    // Save Results
    const outputPath = path.join(__dirname, '../data/analysis_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Analysis complete! Results saved to ${outputPath}`);
}

runAnalysis();
