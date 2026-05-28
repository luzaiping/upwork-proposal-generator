export type ProposalTone = 'Professional' | 'Friendly' | 'Technical';

export type Recommendation = 'high' | 'medium' | 'low';

export type BudgetType = 'fixed' | 'hourly';

export type Budget =
  | { type: 'fixed'; amount: number }
  | { type: 'hourly'; min: number; max: number };

export type ClientHistory = {
  totalJobs: number;
  hireRate: number;
  avgRating: number;
};

export type Job = {
  title?: string;
  description: string;
  skills: string[];
  tone: ProposalTone;
  budget?: Budget;
  clientHistory?: ClientHistory;
};

export type JobAnalysis = {
  difficulty: number;
  matchScore: number;
  requiredSkills: string[];
  missingSkills: string[];
  strategy: string;
  recommendation: Recommendation;
};
