
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { validateBreakdown } from '../schemas/validateBreakdown.js';
import { buildTaskBreakdownPrompt } from '../taskBreakdownPrompt.js';

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

const ResourceSchema = z.object({
  title: z.string(),
  type: z.string(),
  url: z.string()
});

const SubtaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  completionCriteria: z.string(),
  estimatedMinutes: z.number().int().positive().nullable(),
  resources: z.array(ResourceSchema)
});

const BreakdownSchema = z.object({
  status: z.enum([
    'READY',
    'NEEDS_CLARIFICATION',
    'INVALID_INPUT'
  ]),
  message: z.string(),
  clarificationQuestion: z.string().nullable(),
  taskCategory: z.string().nullable(),
  expectedOutcome: z.string().nullable(),
  complexity: z.enum([
    'simple',
    'moderate',
    'complex'
  ]).nullable(),
  subtasks: z.array(SubtaskSchema)
});

export async function generateWithGroq({
  task,
  userPreferences = {},
  taskContext = {}
}) {
  const prompt = buildTaskBreakdownPrompt({
    task,
    userPreferences,
    taskContext
  });

  const response = await ai.responses.parse({
    model: 'openai/gpt-oss-20b',
    input: prompt,
    text: {
      format: zodTextFormat(
        BreakdownSchema,
        'task_breakdown'
      )
    },
    temperature: 0.3
  });

  const result = response.output_parsed;

  if (!result) {
    throw new Error('Groq returned no structured response.');
  }

  return validateBreakdown(result);
}
