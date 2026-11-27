
import { generateWithGemini } from './providers/geminiProvider.js';
import { generateWithGroq } from './providers/groqProvider.js';

const providers = {
  gemini: generateWithGemini,
  groq: generateWithGroq
};

export async function generateTaskBreakdown({
  task,
  userPreferences = {},
  taskContext = {},
  provider = process.env.AI_PROVIDER || 'gemini'
}) {
  const selectedProvider = provider.toLowerCase();
  const generate = providers[selectedProvider];

  if (!generate) {
    throw new Error(
      `Unsupported AI provider: ${selectedProvider}. Use gemini or grok.`
    );
  }

  return generate({
    task,
    userPreferences,
    taskContext
  });
}
