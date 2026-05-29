import type { Job, PriceEvaluation } from '../types/job';
import type { JobAnalysis } from '../types/job';

const DIFFICULTY_HOURS: Record<number, number> = {
  1: 8, 2: 16, 3: 24, 4: 40, 5: 60,
  6: 80, 7: 120, 8: 160, 9: 200, 10: 240,
};

function estimateHours(difficulty: number): number {
  return DIFFICULTY_HOURS[Math.round(difficulty)] ?? 60;
}

function calcClientBudgetRate(job: Job, estimatedHours: number): number | undefined {
  if (!job.budget) return undefined;
  if (job.budget.type === 'hourly') {
    return (job.budget.min + job.budget.max) / 2;
  }
  return job.budget.amount / estimatedHours;
}

function buildSummary(
  budgetLevel: 'low' | 'mid' | 'high',
  recommended: { min: number; max: number },
  clientBudgetRate?: number,
): string {
  if (!clientBudgetRate) {
    return `No client budget provided. Recommended rate: $${recommended.min}-$${recommended.max}/hr.`;
  }
  if (budgetLevel === 'low') {
    return `Client budget is below your target rate ($${Math.round(clientBudgetRate)}/hr effective). Consider negotiating or skipping.`;
  }
  if (budgetLevel === 'high') {
    return `Client budget is above average. Strong earning potential at $${Math.round(clientBudgetRate)}/hr effective.`;
  }
  return `Client budget is reasonable at $${Math.round(clientBudgetRate)}/hr effective. Recommend bidding $${recommended.min}-$${recommended.max}/hr.`;
}

export function evaluatePrice(
  job: Job,
  analysis: JobAnalysis,
): PriceEvaluation {
  const targetRate = job.targetHourlyRate ?? 40;
  const estimatedHours = estimateHours(analysis.difficulty);

  const recommendedMin = Math.round(targetRate * 0.9);
  const recommendedMax = Math.round(targetRate * 1.3 + analysis.difficulty * 2);
  const recommended = { min: recommendedMin, max: recommendedMax };

  const clientBudgetRate = calcClientBudgetRate(job, estimatedHours);

  let budgetLevel: 'low' | 'mid' | 'high' = 'mid';
  let isReasonable = true;

  if (clientBudgetRate !== undefined) {
    if (clientBudgetRate < targetRate * 0.8) {
      budgetLevel = 'low';
      isReasonable = false;
    } else if (clientBudgetRate >= targetRate * 1.3) {
      budgetLevel = 'high';
    } else {
      budgetLevel = 'mid';
    }
  }

  return {
    isReasonable,
    budgetLevel,
    recommendedRate: recommended,
    clientBudgetRate: clientBudgetRate ? Math.round(clientBudgetRate) : undefined,
    summary: buildSummary(budgetLevel, recommended, clientBudgetRate),
  };
}