import type { ProposalFormData } from '../types/proposal';
import type { Job, Budget, ClientHistory } from '../types/job';

export function mapFormToJob(form: ProposalFormData): Job {
  let budget: Budget | undefined;
  if (form.budgetType === 'fixed' && form.budgetAmount) {
    const amount = parseFloat(form.budgetAmount);
    if (!isNaN(amount)) budget = { type: 'fixed', amount };
  } else if (form.budgetType === 'hourly' && form.budgetMin && form.budgetMax) {
    const min = parseFloat(form.budgetMin);
    const max = parseFloat(form.budgetMax);
    if (!isNaN(min) && !isNaN(max)) budget = { type: 'hourly', min, max };
  }

  let clientHistory: ClientHistory | undefined;
  if (form.clientTotalJobs || form.clientHireRate || form.clientAvgRating) {
    clientHistory = {
      totalJobs: parseInt(form.clientTotalJobs || '0'),
      hireRate: parseFloat(form.clientHireRate || '0'),
      avgRating: parseFloat(form.clientAvgRating || '0'),
    };
  }

  return {
    title: form.jobTitle || undefined,
    description: form.jobDescription,
    skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [],
    tone: form.tone,
    budget,
    clientHistory,
    targetHourlyRate: form.targetHourlyRate
      ? parseFloat(form.targetHourlyRate)
      : 40,
  };
}
