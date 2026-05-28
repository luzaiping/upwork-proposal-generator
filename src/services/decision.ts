import type { JobAnalysis } from '../types/job';
import type {
  JobScore,
  CompetitionEstimation,
  DecisionSummary,
  Verdict,
} from '../types/scoring';
import type { TimingAdvice } from '../types/job';

function buildSummary(
  verdict: Verdict,
  score: JobScore,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analysis: JobAnalysis,
): string {
  if (verdict === 'apply') {
    return `Strong match with ${score.overallScore}/100 overall score — recommended to apply.`;
  }
  if (verdict === 'skip') {
    return `Low match or high risk with ${score.overallScore}/100 overall score — not recommended.`;
  }
  return `Moderate match with ${score.overallScore}/100 overall score — apply with caution.`;
}

function buildHighlights(
  analysis: JobAnalysis,
  score: JobScore,
  competition: CompetitionEstimation,
  timingAdvice: TimingAdvice | null
): string[] {
  const highlights: string[] = [];

  if (score.applyConfidence >= 70)
    highlights.push(`High apply confidence: ${score.applyConfidence}%`);
  if (analysis.matchScore >= 75)
    highlights.push('Strong skill alignment with job requirements');
  if (analysis.missingSkills.length === 0)
    highlights.push('No skill gaps detected');
  if (competition.competitionLevel === 'low')
    highlights.push('Low competition in this category');
  if (competition.marketType === 'niche')
    highlights.push('Niche market reduces applicant pool');
  if (competition.differentiationPotential === 'high')
    highlights.push('High potential to stand out');
  if (analysis.recommendation === 'high')
    highlights.push('AI analysis recommends applying');

  if (timingAdvice?.windowStatus === 'open') {
    highlights.push(
      `Job posted ${timingAdvice.hoursElapsed}hr ago, apply now for best chance`,
    );
  }

  return highlights;
}

function buildConcerns(
  analysis: JobAnalysis,
  score: JobScore,
  competition: CompetitionEstimation,
  timingAdvice: TimingAdvice | null,
): string[] {
  const concerns: string[] = [];

  if (analysis.missingSkills.length >= 3)
    concerns.push(
      `Significant skill gaps: ${analysis.missingSkills.join(', ')}`,
    );
  else if (analysis.missingSkills.length > 0)
    concerns.push(`Minor skill gaps: ${analysis.missingSkills.join(', ')}`);
  if (analysis.difficulty >= 8)
    concerns.push('High complexity job may require significant effort');
  if (competition.competitionLevel === 'high')
    concerns.push('High competition detected');
  if (competition.saturationRisk >= 70)
    concerns.push('Market saturation risk is high');
  if (score.riskLevel === 'high') concerns.push('Overall risk level is high');
  if (score.estimatedWinRate < 20)
    concerns.push(`Low estimated win rate: ${score.estimatedWinRate}%`);
  if (analysis.recommendation === 'low')
    concerns.push('AI analysis advises against applying');

  if (timingAdvice?.windowStatus === 'closed') {
    concerns.push(
      `Job posted ${timingAdvice.hoursElapsed}hr ago, competition window likely closed`,
    );
  } else if (timingAdvice?.windowStatus === 'narrowing') {
    concerns.push(`Job posted ${timingAdvice.hoursElapsed}hr ago, apply today`);
  }

  return concerns;
}

export function buildDecision(
  analysis: JobAnalysis,
  score: JobScore,
  competition: CompetitionEstimation,
  timingAdvice: TimingAdvice | null,
): DecisionSummary {
  let verdict: Verdict;

  if (
    score.overallScore >= 70 &&
    competition.competitionScore < 70 &&
    analysis.recommendation === 'high'
  ) {
    verdict = 'apply';
  } else if (score.overallScore < 50 || analysis.recommendation === 'low') {
    verdict = 'skip';
  } else {
    verdict = 'consider';
  }

  const highlights = buildHighlights(analysis, score, competition, timingAdvice);
  const concerns = buildConcerns(analysis, score, competition, timingAdvice);

  const confidence = Math.round(
    score.applyConfidence * 0.5 +
      score.overallScore * 0.3 +
      (100 - competition.competitionScore) * 0.2,
  );

  return {
    verdict,
    confidence: Math.min(confidence, 100),
    summary: buildSummary(verdict, score, analysis),
    highlights,
    concerns,
    timingAdvice,
  };
}
