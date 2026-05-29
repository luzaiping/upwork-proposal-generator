import type { JobAnalysis } from '../types/job';
import type { JobScore, CompetitionEstimation, ConnectsEstimation } from '../types/scoring';

export function estimateConnects(
  analysis: JobAnalysis,
  score: JobScore,
  competition: CompetitionEstimation,
): ConnectsEstimation {
  let estimatedConnects = 6;

  if (competition.competitionLevel === 'high') estimatedConnects += 4;
  else if (competition.competitionLevel === 'medium') estimatedConnects += 2;

  if (analysis.difficulty >= 7) estimatedConnects += 2;

  estimatedConnects = Math.min(estimatedConnects, 16);

  const worthSpending = score.applyConfidence >= 60;

  let reason: string;
  if (!worthSpending) {
    reason = `Low apply confidence (${score.applyConfidence}%) — not worth spending ${estimatedConnects} connects.`;
  } else if (estimatedConnects >= 12) {
    reason = `High connects cost due to competition and complexity. Only apply if highly confident.`;
  } else if (estimatedConnects <= 6) {
    reason = `Low connects cost with reasonable win probability — good value.`;
  } else {
    reason = `Moderate connects cost. Apply confidence ${score.applyConfidence}% justifies the spend.`;
  }

  return { estimatedConnects, worthSpending, reason };
}