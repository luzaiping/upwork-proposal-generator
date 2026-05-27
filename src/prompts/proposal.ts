import type { Job } from '../types/job';

export function buildProposalPrompt(params: Job) {
  return `
You are a top 1% senior freelance frontend engineer on Upwork.

Generate a response in STRICT JSON format.

Return ONLY valid JSON.

JSON structure:

{
  "coverLetter": "short upwork cover letter",
  "proposal": "detailed markdown proposal"
}

RULES:

- coverLetter:
  - short
  - concise
  - 3-5 sentences
  - optimized for first contact

- proposal:
  - markdown format
  - structured sections
  - professional
  - client-focused

Tone: ${params.tone}

Skills:
${params.skills}

Job Description:
${params.description}
`;
}
