
import { GoogleGenAI } from '@google/genai';
import { TASK_BREAKDOWN_SCHEMA } from '../schemas/taskBreakdownSchema.js';
import { validateBreakdown } from '../schemas/validateBreakdown.js';
import { buildTaskBreakdownPrompt } from '../taskBreakdownPrompt.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateWithGemini({
  task,
  userPreferences = {},
  taskContext = {}
}) {
  const prompt = buildTaskBreakdownPrompt({
    task,
    userPreferences,
    taskContext
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: TASK_BREAKDOWN_SCHEMA
    }
  });

  if (!response.text) {
    throw new Error('Gemini returned an empty response.');
  }

  const result = JSON.parse(response.text);

  return validateBreakdown(result);
}
