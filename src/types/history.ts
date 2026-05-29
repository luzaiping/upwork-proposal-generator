import type { Job } from './job';
import type { JobAnalysis } from './job';
import type { ProposalContent } from './proposal';
import type { JobScore, CompetitionEstimation, DecisionSummary, ConnectsEstimation } from './scoring';
import type { PriceEvaluation } from './job';

export type HistoryRecord = {
  id: string;
  savedAt: string;
  job: Job;
  analysis: JobAnalysis;
  jobScore: JobScore;
  competition: CompetitionEstimation;
  decision: DecisionSummary;
  priceEval: PriceEvaluation;
  connectsEst: ConnectsEstimation;
  proposalContent: ProposalContent;
};