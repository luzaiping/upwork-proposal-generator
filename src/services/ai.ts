import type { ProposalTone } from '../types/job';
import type { ProposalResultData } from '../types/proposal';
import { buildProposalPrompt } from '../prompts/proposal';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function generateProposal(params: {
  description: string;
  skills: string[];
  tone: ProposalTone;
  signal?: AbortSignal;
}): Promise<ProposalResultData> {
  const prompt = buildProposalPrompt(params);

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
      temperature: 0.7,
    }),
    signal: params.signal,
  });

  const data = await res.json();

  const content = data.choices?.[0]?.message?.content || '{}';

  try {
    return JSON.parse(content);
  } catch {
    return {
      coverLetter: '',
      proposal: 'Failed to parse AI response.',
    };
  }
}
