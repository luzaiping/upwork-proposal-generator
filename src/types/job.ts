export type ProposalTone = 'Professional' | 'Friendly' | 'Technical';

export type Recommendation = 'high' | 'medium' | 'low';

export type Job = {
  title?: string;

  description: string;

  skills: string[];

  tone: ProposalTone;
};

export type JobAnalysis = {
  difficulty: number;

  matchScore: number;

  requiredSkills: string[];

  missingSkills: string[];

  strategy: string;

  recommendation: Recommendation;
};
