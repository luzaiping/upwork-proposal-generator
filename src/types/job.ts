export type ProposalTone =
  | 'Professional'
  | 'Friendly'
  | 'Confident'

export type Job = {
  title?: string
  description: string

  skills: string[]

  tone: ProposalTone
}