import type { Job, ProposalTone } from './job';

export type ProposalFormData = {
  jobDescription: string;
  skills: string;
  tone: ProposalTone;
  jobTitle?: string;
  budgetType?: 'fixed' | 'hourly';
  budgetAmount?: string;
  budgetMin?: string;
  budgetMax?: string;
  clientTotalJobs?: string;
  clientHireRate?: string;
  clientAvgRating?: string;
  targetHourlyRate?: string;
  jobPostedAt?: string;
};

export type ProposalContent = {
  coverLetter: string;
  proposal: string;
};

// 新增：内部统一模型（AI pipeline用）
export type JobModel = Job;
