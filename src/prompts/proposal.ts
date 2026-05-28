import type { Job } from '../types/job';

export function buildProposalPrompt(params: Job) {
  return `
You are a top 1% senior freelance frontend engineer on Upwork.

Generate the response in the following EXACT format, do not add any other content:

===COVER_LETTER===
(write cover letter here)
===PROPOSAL===
(write proposal here)

RULES:

- Cover Letter:
  - short, concise, 3-5 sentences
  - optimized for first contact

- Proposal:
  - markdown format
  - structured sections
  - professional, client-focused

Tone: ${params.tone}

Skills:
${params.skills.join(', ')}

Job Description:
${params.description}
`;
}
