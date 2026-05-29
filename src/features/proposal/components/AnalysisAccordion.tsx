import { useState as useLocalState } from 'react';

import type { JobAnalysis } from '../../../types/job';
import type { JobScore } from '../../../types/scoring';
import type { CompetitionEstimation } from '../../../types/scoring';
import type { PriceEvaluation } from '../../../types/job';

export default function AnalysisAccordion({
  analysis,
  jobScore,
  competition,
  priceEval,
}: {
  analysis: JobAnalysis | null;
  jobScore: JobScore | null;
  competition: CompetitionEstimation | null;
  priceEval: PriceEvaluation | null;
}) {
  const [open, setOpen] = useLocalState(false);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-sm font-semibold text-white"
      >
        Analysis Details
        <span className="text-zinc-500">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="space-y-4 px-4 pb-4">
          {/* Job Analysis */}
          {analysis && (
            <div className="space-y-3 text-sm text-zinc-300">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Job Analysis
              </h3>
              <div>
                <span className="text-zinc-500">Difficulty:</span>{' '}
                {analysis.difficulty}/10
              </div>
              <div>
                <span className="text-zinc-500">Match Score:</span>{' '}
                {analysis.matchScore}%
              </div>
              <div>
                <span className="text-zinc-500">Recommendation:</span>{' '}
                {analysis.recommendation}
              </div>
              <div>
                <span className="text-zinc-500">Required Skills:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-zinc-800 px-2 py-1 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Missing Skills:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Strategy:</span>
                <p className="mt-1 leading-7">{analysis.strategy}</p>
              </div>
            </div>
          )}

          {/* Job Score */}
          {jobScore && (
            <div className="space-y-3 text-sm text-zinc-300 pt-3 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Job Score
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Overall Score
                  </div>
                  <div className="text-xl font-bold text-white">
                    {jobScore.overallScore}
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Apply Confidence
                  </div>
                  <div className="text-xl font-bold text-white">
                    {jobScore.applyConfidence}%
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Est. Win Rate
                  </div>
                  <div className="text-xl font-bold text-white">
                    {jobScore.estimatedWinRate}%
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">Competition</div>
                  <div className="text-xl font-bold text-white capitalize">
                    {jobScore.competitionLevel}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Risk Level:</span>{' '}
                <span
                  className={
                    jobScore.riskLevel === 'low'
                      ? 'text-emerald-400'
                      : jobScore.riskLevel === 'medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {jobScore.riskLevel}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-2">Reasons:</span>
                <ul className="space-y-1">
                  {jobScore.reasons.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <span className="mt-0.5 text-zinc-600">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Competition */}
          {competition && (
            <div className="space-y-3 text-sm text-zinc-300 pt-3 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Competition Analysis
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Competition Score
                  </div>
                  <div className="text-xl font-bold text-white">
                    {competition.competitionScore}
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Saturation Risk
                  </div>
                  <div className="text-xl font-bold text-white">
                    {competition.saturationRisk}%
                  </div>
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Market Type:</span>{' '}
                <span className="capitalize">{competition.marketType}</span>
              </div>
              <div>
                <span className="text-zinc-500">
                  Differentiation Potential:
                </span>{' '}
                <span
                  className={
                    competition.differentiationPotential === 'high'
                      ? 'text-emerald-400'
                      : competition.differentiationPotential === 'medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {competition.differentiationPotential}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-2">Reasoning:</span>
                <ul className="space-y-1">
                  {competition.reasoning.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <span className="mt-0.5 text-zinc-600">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Price Evaluation */}
          {priceEval && (
            <div className="space-y-3 text-sm text-zinc-300 pt-3 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Price Evaluation
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-900 p-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Recommended Rate
                  </div>
                  <div className="text-base font-bold text-white">
                    ${priceEval.recommendedRate.min}–$
                    {priceEval.recommendedRate.max}/hr
                  </div>
                </div>
                {priceEval.clientBudgetRate && (
                  <div className="rounded-lg bg-zinc-900 p-3">
                    <div className="text-xs text-zinc-500 mb-1">
                      Client Effective Rate
                    </div>
                    <div
                      className={`text-base font-bold ${priceEval.budgetLevel === 'low' ? 'text-red-400' : priceEval.budgetLevel === 'high' ? 'text-emerald-400' : 'text-white'}`}
                    >
                      ${priceEval.clientBudgetRate}/hr
                    </div>
                  </div>
                )}
              </div>
              <div>
                <span className="text-zinc-500">Budget Level:</span>{' '}
                <span
                  className={
                    priceEval.budgetLevel === 'low'
                      ? 'text-red-400'
                      : priceEval.budgetLevel === 'high'
                        ? 'text-emerald-400'
                        : 'text-yellow-400'
                  }
                >
                  {priceEval.budgetLevel}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Reasonable:</span>{' '}
                <span
                  className={
                    priceEval.isReasonable ? 'text-emerald-400' : 'text-red-400'
                  }
                >
                  {priceEval.isReasonable ? 'Yes' : 'No'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-5">
                {priceEval.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
