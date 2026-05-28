import type { Job } from '../types/job'

export function buildAnalysisPrompt(
  job: Job
) {
  return `
You are an expert Upwork freelance advisor.

Analyze the following freelance job.

Return ONLY valid JSON.

JSON structure:

{
  "difficulty": number,
  "matchScore": number,
  "requiredSkills": string[],
  "missingSkills": string[],
  "strategy": string,
  "recommendation": "high" | "medium" | "low"
}

RULES:

- difficulty:
  1-10

- matchScore:
  0-100

- requiredSkills:
  important technical skills required

- missingSkills:
  skills likely missing from candidate profile

- strategy:
  concise proposal strategy

- recommendation:
  high = strongly recommend applying
  medium = optional
  low = not recommended

Candidate Skills:
${job.skills.join(', ')}

Job Description:
${job.description}
`
}