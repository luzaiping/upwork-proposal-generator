import type { ProposalFormData } from '../types/proposal'
import type { Job } from '../types/job'

export function mapFormToJob(
  form: ProposalFormData
): Job {
  return {
    description: form.jobDescription,
    skills: form.skills
      ? form.skills.split(',').map(s => s.trim())
      : [],
    tone: form.tone,
  }
}