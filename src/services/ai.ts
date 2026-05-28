import type { ProposalTone } from '../types/job';
import type { ProposalContent } from '../types/proposal';
import { buildProposalPrompt } from '../prompts/proposal';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function generateProposal(params: {
  description: string;
  skills: string[];
  tone: ProposalTone;
  signal?: AbortSignal;
  onChunk?: (content: ProposalContent) => void;
}): Promise<ProposalContent> {
  const prompt = buildProposalPrompt(params);

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
    signal: params.signal,
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const parse = (raw: string): ProposalContent => {
    const coverMatch = raw.match(
      /===COVER_LETTER===\n([\s\S]*?)(?:===PROPOSAL===|$)/,
    );
    const proposalMatch = raw.match(/===PROPOSAL===\n([\s\S]*)/);
    return {
      coverLetter: coverMatch?.[1]?.trim() ?? '',
      proposal: proposalMatch?.[1]?.trim() ?? '',
    };
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

    for (const line of lines) {
      const json = line.replace('data: ', '').trim();
      if (json === '[DONE]') break;
      try {
        const delta = JSON.parse(json).choices?.[0]?.delta?.content;
        if (delta) {
          buffer += delta;
          params.onChunk?.(parse(buffer));
        }
      } catch {
        // skip malformed chunk
      }
    }
  }

  return parse(buffer);
}
