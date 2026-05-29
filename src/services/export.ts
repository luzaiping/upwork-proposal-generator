import type { JobAnalysis } from '../types/job';
import type { ProposalContent } from '../types/proposal';
import type { JobScore, CompetitionEstimation, DecisionSummary, ConnectsEstimation } from '../types/scoring';
import type { PriceEvaluation } from '../types/job';

export function exportToMarkdown(params: {
  analysis: JobAnalysis;
  jobScore: JobScore;
  competition: CompetitionEstimation;
  decision: DecisionSummary;
  priceEval: PriceEvaluation;
  connectsEst: ConnectsEstimation;
  proposalContent: ProposalContent;
}): void {
  const { analysis, jobScore, competition, decision, priceEval, connectsEst, proposalContent } = params;

  const lines: string[] = [];

  // Decision
  lines.push('# Decision');
  lines.push(`**Verdict**: ${decision.verdict.toUpperCase()}`);
  lines.push(`**Confidence**: ${decision.confidence}%`);
  lines.push(`**Summary**: ${decision.summary}`);
  if (decision.timingAdvice) {
    lines.push(`**Timing**: ${decision.timingAdvice.advice}`);
  }
  lines.push(`**Est. Connects**: ${connectsEst.estimatedConnects} — ${connectsEst.reason}`);
  if (decision.highlights.length > 0) {
    lines.push('');
    lines.push('**Highlights**');
    decision.highlights.forEach(h => lines.push(`- ✓ ${h}`));
  }
  if (decision.concerns.length > 0) {
    lines.push('');
    lines.push('**Concerns**');
    decision.concerns.forEach(c => lines.push(`- ✗ ${c}`));
  }

  // Price Evaluation
  lines.push('');
  lines.push('# Price Evaluation');
  lines.push(`**Recommended Rate**: $${priceEval.recommendedRate.min}–$${priceEval.recommendedRate.max}/hr`);
  if (priceEval.clientBudgetRate) {
    lines.push(`**Client Effective Rate**: $${priceEval.clientBudgetRate}/hr`);
  }
  lines.push(`**Budget Level**: ${priceEval.budgetLevel}`);
  lines.push(`**Reasonable**: ${priceEval.isReasonable ? 'Yes' : 'No'}`);
  lines.push(`${priceEval.summary}`);

  // Job Analysis
  lines.push('');
  lines.push('# Job Analysis');
  lines.push(`**Difficulty**: ${analysis.difficulty}/10`);
  lines.push(`**Match Score**: ${analysis.matchScore}%`);
  lines.push(`**Recommendation**: ${analysis.recommendation}`);
  lines.push(`**Overall Score**: ${jobScore.overallScore}`);
  lines.push(`**Apply Confidence**: ${jobScore.applyConfidence}%`);
  lines.push(`**Est. Win Rate**: ${jobScore.estimatedWinRate}%`);
  lines.push(`**Risk Level**: ${jobScore.riskLevel}`);
  lines.push(`**Competition Score**: ${competition.competitionScore}`);
  lines.push(`**Saturation Risk**: ${competition.saturationRisk}%`);
  lines.push(`**Market Type**: ${competition.marketType}`);
  lines.push(`**Differentiation Potential**: ${competition.differentiationPotential}`);
  if (analysis.requiredSkills.length > 0) {
    lines.push(`**Required Skills**: ${analysis.requiredSkills.join(', ')}`);
  }
  if (analysis.missingSkills.length > 0) {
    lines.push(`**Missing Skills**: ${analysis.missingSkills.join(', ')}`);
  }
  lines.push('');
  lines.push(`**Strategy**: ${analysis.strategy}`);

  // Cover Letter
  lines.push('');
  lines.push('# Cover Letter');
  lines.push(proposalContent.coverLetter);

  // Full Proposal
  lines.push('');
  lines.push('# Full Proposal');
  lines.push(proposalContent.proposal);

  // download
  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `proposal-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}