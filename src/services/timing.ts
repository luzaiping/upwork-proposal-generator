import type { TimingAdvice } from '../types/job';

export function evaluateTiming(jobPostedAt?: string): TimingAdvice | null {
  if (!jobPostedAt) return null;

  const posted = new Date(jobPostedAt);
  const now = new Date();
  const hoursElapsed = Math.round((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

  let windowStatus: TimingAdvice['windowStatus'];
  let advice: string;

  if (hoursElapsed < 24) {
    windowStatus = 'open';
    advice = `Posted ${hoursElapsed}hr ago — competition window is open, apply as soon as possible.`;
  } else if (hoursElapsed <= 72) {
    windowStatus = 'narrowing';
    advice = `Posted ${hoursElapsed}hr ago — window is narrowing, apply today to stay competitive.`;
  } else {
    windowStatus = 'closed';
    advice = `Posted ${hoursElapsed}hr ago — likely has many applicants already, lower win probability.`;
  }

  return { hoursElapsed, windowStatus, advice };
}