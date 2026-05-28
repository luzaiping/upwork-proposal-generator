export type RiskLevel = 'low' | 'medium' | 'high';
export type CompetitionLevel = 'low' | 'medium' | 'high';

export type JobScore = {
  overallScore: number;
  applyConfidence: number;
  estimatedWinRate: number;
  competitionLevel: CompetitionLevel;
  riskLevel: RiskLevel;
  reasons: string[];
};