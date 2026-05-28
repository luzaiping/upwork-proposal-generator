import type { Job, ProposalTone } from './job';

export type ProposalFormData = {
  jobDescription: string;
  skills: string;
  tone: ProposalTone;
};

export type ProposalContent = {
  coverLetter: string;
  proposal: string;
};

// 新增：内部统一模型（AI pipeline用）
export type JobModel = Job;
