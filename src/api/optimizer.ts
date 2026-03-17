import { AgentLogger, DatabaseService } from '../services/mock-services';

type LLMRouter = (input: { provider: 'groq' | 'gemini' | 'claude'; prompt: string }) => Promise<{ text: string }>;

export async function analyzeAndImprove(llmRouter: LLMRouter): Promise<{
  analyzedErrors: number;
  suggestionStored: boolean;
}> {
  const recentErrors = await AgentLogger.getRecentErrors(20);
  if (!recentErrors.length) {
    return { analyzedErrors: 0, suggestionStored: false };
  }

  const errorDigest = recentErrors.map((entry, index) => `${index + 1}. ${entry.message}`).join('\n');
  const prompt = [
    'You are an AI engineer. Analyze why these workflow steps failed and output an optimized, more robust prompt for Step 2.',
    '',
    'Recent failures:',
    errorDigest
  ].join('\n');

  const result = await llmRouter({ provider: 'claude', prompt });
  const suggestion = String(result.text || '').trim();

  await DatabaseService.saveSuggestedFix({
    source: 'self_improvement_loop',
    prompt,
    suggestedFix: suggestion,
    requiresApproval: true,
    createdAt: new Date().toISOString()
  });

  return {
    analyzedErrors: recentErrors.length,
    suggestionStored: Boolean(suggestion)
  };
}
