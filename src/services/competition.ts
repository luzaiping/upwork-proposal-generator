import type { CompetitionEstimation, CompetitionLevel, MarketType, DifferentiationPotential } from '../types/scoring';

const HIGH_COMPETITION_KEYWORDS = [
  'react', 'vue', 'angular', 'wordpress', 'shopify',
  'landing page', 'crud', 'admin panel', 'dashboard',
  'many applicants', '100+ applicants', 'highly competitive',
];

const SPECIALIZATION_KEYWORDS = [
  'web3', 'blockchain', 'solana', 'three.js', 'webgl',
  'd3', 'canvas', 'animation', 'real-time', 'websocket',
  'performance optimization', 'accessibility', 'a11y',
];

const NICHE_KEYWORDS = [
  'proprietary', 'legacy system', 'specific industry',
  'domain expertise', 'fintech', 'healthtech', 'edtech',
  'trading', 'medical', 'compliance',
];

const COMMODITY_KEYWORDS = [
  'simple', 'basic', 'standard', 'typical', 'common',
  'generic', 'normal', 'regular',
];

const AI_KEYWORDS = [
  'ai', 'chatgpt', 'openai', 'llm', 'gpt', 'claude',
  'machine learning', 'automation',
];

function countHits(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter(k => lower.includes(k)).length;
}

function detectMarketType(description: string): MarketType {
  const nicheHits = countHits(description, NICHE_KEYWORDS);
  const specHits = countHits(description, SPECIALIZATION_KEYWORDS);
  const commodityHits = countHits(description, COMMODITY_KEYWORDS);

  if (nicheHits >= 2) return 'niche';
  if (specHits >= 2) return 'specialized';
  if (commodityHits >= 2 || (specHits === 0 && nicheHits === 0)) return 'commodity';
  return 'specialized';
}

function detectDifferentiation(
  description: string,
  marketType: MarketType,
): DifferentiationPotential {
  if (marketType === 'niche') return 'high';
  if (marketType === 'commodity') return 'low';
  const specHits = countHits(description, SPECIALIZATION_KEYWORDS);
  return specHits >= 1 ? 'medium' : 'low';
}

function buildReasoning(
  description: string,
  marketType: MarketType,
  competitionScore: number,
): string[] {
  const reasons: string[] = [];
  const lower = description.toLowerCase();

  if (marketType === 'commodity') reasons.push('Generic job type with high applicant volume');
  if (marketType === 'specialized') reasons.push('Requires specialized technical skills');
  if (marketType === 'niche') reasons.push('Niche domain reduces competition pool');

  const aiHits = countHits(description, AI_KEYWORDS);
  if (aiHits >= 2) reasons.push('Popular AI keywords attract more applicants');

  const highHits = countHits(description, HIGH_COMPETITION_KEYWORDS);
  if (highHits >= 3) reasons.push('Common tech stack increases competition');

  if (lower.includes('many applicants') || lower.includes('100+')) {
    reasons.push('Client explicitly noted high applicant count');
  }

  if (competitionScore >= 75) reasons.push('High saturation in this job category');
  else if (competitionScore <= 40) reasons.push('Low competition, good opportunity window');

  return reasons;
}

export function estimateCompetition(description: string): CompetitionEstimation {
  const highHits = countHits(description, HIGH_COMPETITION_KEYWORDS);
  const specHits = countHits(description, SPECIALIZATION_KEYWORDS);
  const aiHits = countHits(description, AI_KEYWORDS);

  const competitionScore = Math.min(
    Math.round(highHits * 12 + aiHits * 8 - specHits * 6 + 40),
    100,
  );

  const saturationRisk = Math.min(
    Math.round(competitionScore * 0.85 + highHits * 5),
    100,
  );

  const competitionLevel: CompetitionLevel =
    competitionScore >= 70 ? 'high' :
    competitionScore >= 45 ? 'medium' : 'low';

  const marketType = detectMarketType(description);
  const differentiationPotential = detectDifferentiation(description, marketType);
  const reasoning = buildReasoning(description, marketType, competitionScore);

  return {
    competitionLevel,
    competitionScore,
    saturationRisk,
    marketType,
    differentiationPotential,
    reasoning,
  };
}