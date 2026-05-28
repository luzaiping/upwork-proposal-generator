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
  targetHourlyRate?: number;
  jobPostedAt?: string;
};

export type JobAnalysis = {
  difficulty: number;
  matchScore: number;
  requiredSkills: string[];
  missingSkills: string[];
  strategy: string;
  recommendation: Recommendation;
};

export type PriceEvaluation = {
  isReasonable: boolean;
  budgetLevel: 'low' | 'mid' | 'high';
  recommendedRate: { min: number; max: number };
  clientBudgetRate?: number;
  summary: string;
};

export type TimingAdvice = {
  hoursElapsed: number;
  windowStatus: 'open' | 'narrowing' | 'closed';
  advice: string;
};