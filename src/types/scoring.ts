import type { TimingAdvice } from "./job";

export type RiskLevel = 'low' | 'medium' | 'high';
export type CompetitionLevel = 'low' | 'medium' | 'high';

export type MarketType = 'commodity' | 'specialized' | 'niche';
export type DifferentiationPotential = 'low' | 'medium' | 'high';

export type Verdict = 'apply' | 'consider' | 'skip';

export type DecisionSummary = {
  verdict: Verdict;
  confidence: number;
  summary: string;
  highlights: string[];
  concerns: string[];
  timingAdvice: TimingAdvice | null;
};

export type JobScore = {
  overallScore: number;
  applyConfidence: number;
  estimatedWinRate: number;
  competitionLevel: CompetitionLevel;
  riskLevel: RiskLevel;
  reasons: string[];
};

export type CompetitionEstimation = {
  competitionLevel: CompetitionLevel;
  competitionScore: number;
  saturationRisk: number;
  marketType: MarketType;
  differentiationPotential: DifferentiationPotential;
  reasoning: string[];
};

export type ConnectsEstimation = {
  estimatedConnects: number;
  worthSpending: boolean;
  reason: string;
};