export type ProposalTone =
  | 'Professional'
  | 'Friendly'
  | 'Confident'

export type ProposalFormData = {
  jobDescription: string
  skills: string
  tone: ProposalTone
}

export type ProposalResultData = {
  coverLetter: string
  proposal: string
}