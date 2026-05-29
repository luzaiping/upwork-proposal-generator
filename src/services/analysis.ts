import type { Job, JobAnalysis } from '../types/job';

import { buildAnalysisPrompt } from '../prompts/analysis';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function analyzeJob(job: Job): Promise<JobAnalysis> {
  const prompt = buildAnalysisPrompt(job);

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },

    body: JSON.stringify({
      model: 'deepseek-chat',

      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    if (res.status === 401)
      throw new Error('Invalid API key, please check your configuration.');
    if (res.status === 429)
      throw new Error('API rate limit reached, please try again later.');
    if (res.status === 402)
      throw new Error('Insufficient API balance, please top up your account.');
    throw new Error(`Request failed (${res.status}), please try again.`);
  }

  const data = await res.json();

  const content = data.choices?.[0]?.message?.content || '{}';

  const cleaned = content.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      difficulty: 0,
      matchScore: 0,
      requiredSkills: [],
      missingSkills: [],
      strategy: 'Failed to parse AI response.',
      recommendation: 'low',
    };
  }
}
