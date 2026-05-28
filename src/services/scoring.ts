import type { Budget, ClientHistory, JobAnalysis } from '../types/job';
import type { JobScore, RiskLevel, CompetitionLevel } from '../types/scoring';

const COMPETITION_KEYWORDS = [
  'many applicants',
  'highly competitive',
  'lots of proposals',
  'competitive rate',
  '100+ applicants',
];

const BUDGET_UNCLEAR_KEYWORDS = [
  'negotiable',
  'to be discussed',
  'tbd',
  'flexible budget',
  'open budget',
];

function detectCompetition(description: string): CompetitionLevel {
  const lower = description.toLowerCase();
  const hit = COMPETITION_KEYWORDS.some((k) => lower.includes(k));
  return hit ? 'high' : 'medium';
}

function detectBudgetClarity(description: string): number {
  const lower = description.toLowerCase();
  const unclear = BUDGET_UNCLEAR_KEYWORDS.some((k) => lower.includes(k));
  const hasBudget = /\$[\d,]+|\d+\s*(usd|\/hr|\/hour|per hour)/i.test(
    description,
  );
  if (hasBudget) return 100;
  if (unclear) return 30;
  return 60;
}

function buildReasons(
  analysis: JobAnalysis,
  competitionLevel: CompetitionLevel,
  budgetClarity: number,
  budget?: Budget,
  clientHistory?: ClientHistory,
): string[] {
  const reasons: string[] = [];

  if (analysis.matchScore >= 75)
    reasons.push('Strong skill match with job requirements');
  else if (analysis.matchScore >= 50) reasons.push('Partial skill match');
  else reasons.push('Low skill match');

  if (analysis.missingSkills.length === 0)
    reasons.push('No missing skills detected');
  else if (analysis.missingSkills.length <= 2)
    reasons.push(`Minor skill gaps: ${analysis.missingSkills.join(', ')}`);
  else
    reasons.push(
      `Significant skill gaps: ${analysis.missingSkills.join(', ')}`,
    );

  if (analysis.difficulty >= 8) reasons.push('High complexity job');
  else if (analysis.difficulty <= 4)
    reasons.push('Low complexity, good for quick win');

  if (competitionLevel === 'high')
    reasons.push('High competition detected in job post');
  if (budgetClarity < 50) reasons.push('Client budget unclear');
  else if (budgetClarity === 100) reasons.push('Budget clearly stated');

  if (analysis.recommendation === 'high')
    reasons.push('AI recommends applying');
  else if (analysis.recommendation === 'low')
    reasons.push('AI advises against applying');

  if (budget) {
    if (budget.type === 'fixed')
      reasons.push(`Fixed budget: $${budget.amount}`);
    else reasons.push(`Hourly rate: $${budget.min}-$${budget.max}/hr`);
  }

  if (clientHistory) {
    if (clientHistory.avgRating >= 4.5)
      reasons.push('Client has excellent rating history');
    else if (clientHistory.avgRating < 3.5 && clientHistory.avgRating > 0)
      reasons.push('Client has low rating history');
    if (clientHistory.hireRate < 30 && clientHistory.totalJobs > 5)
      reasons.push('Client has low hire rate');
    if (clientHistory.hireRate >= 70)
      reasons.push('Client has strong hire rate');
  }

  return reasons;
}

export function scoreJob(
  analysis: JobAnalysis,
  description: string,
  budget?: Budget,
  clientHistory?: ClientHistory,
): JobScore {
  const budgetClarity = budget ? 100 : detectBudgetClarity(description);
  const competitionLevel = detectCompetition(description);

  const overallScore = Math.round(
    analysis.matchScore * 0.5 +
      (10 - analysis.difficulty) * 10 * 0.3 +
      budgetClarity * 0.2,
  );

  const missingPenalty = Math.min(analysis.missingSkills.length * 8, 30);

  let clientBonus = 0;
  if (clientHistory) {
    if (clientHistory.avgRating >= 4.5) clientBonus += 8;
    else if (clientHistory.avgRating >= 4.0) clientBonus += 4;
    if (clientHistory.hireRate >= 70) clientBonus += 5;
    else if (clientHistory.hireRate < 30) clientBonus -= 5;
    if (clientHistory.totalJobs >= 10) clientBonus += 3;
  }

  const applyConfidence = Math.round(
    Math.min(
      overallScore -
        missingPenalty +
        (analysis.recommendation === 'high' ? 10 : 0) +
        clientBonus,
      100,
    ),
  );

  const competitionPenalty =
    competitionLevel === 'high' ? 15 : competitionLevel === 'medium' ? 8 : 0;
  const estimatedWinRate = Math.round(
    Math.max(applyConfidence * 0.6 - competitionPenalty, 5),
  );

  const riskLevel: RiskLevel =
    overallScore >= 75 ? 'low' : overallScore >= 50 ? 'medium' : 'high';

  const reasons = buildReasons(
    analysis,
    competitionLevel,
    budgetClarity,
    budget,
    clientHistory,
  );

  return {
    overallScore: Math.min(overallScore, 100),
    applyConfidence: Math.min(applyConfidence, 100),
    estimatedWinRate: Math.min(estimatedWinRate, 100),
    competitionLevel,
    riskLevel,
    reasons,
  };
}
