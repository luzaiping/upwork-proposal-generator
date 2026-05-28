import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import type { ProposalContent } from '../../../types/proposal';
import type { JobAnalysis } from '../../../types/job';
import type { JobScore } from '../../../types/scoring';
import type { CompetitionEstimation } from '../../../types/scoring';
import type { DecisionSummary } from '../../../types/scoring';
import type { PriceEvaluation } from '../../../types/job';

type Props = {
  analysis: JobAnalysis | null;
  jobScore: JobScore | null;
  competition: CompetitionEstimation | null;
  decision: DecisionSummary | null;
  priceEval: PriceEvaluation | null;
  proposalContent: ProposalContent | null;
  loading: boolean;
  loadingStep: 'idle' | 'analyzing' | 'generating';
};

export default function ProposalResult({
  analysis,
  jobScore,
  competition,
  decision,
  priceEval,
  proposalContent,
  loading,
  loadingStep,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);

    setCopied(type);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  const formatResult = (text: string) => {
    return text.replace(/###/g, '##').replace(/\n{3,}/g, '\n\n');
  };

  if (!analysis && !proposalContent && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        AI proposal will appear here
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* loading */}
      {loading && (
        <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400">
          <span className="animate-pulse">●</span>
          {loadingStep === 'analyzing'
            ? 'Analyzing job...'
            : 'Generating proposal...'}
        </div>
      )}

      {/* content */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* decision */}
        {decision && (
          <section
            className={`rounded-xl border p-4 ${
              decision.verdict === 'apply'
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : decision.verdict === 'skip'
                  ? 'border-red-500/40 bg-red-500/10'
                  : 'border-yellow-500/40 bg-yellow-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Decision</h2>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${
                  decision.verdict === 'apply'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : decision.verdict === 'skip'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {decision.verdict.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-zinc-300 mb-3">{decision.summary}</p>

            <div className="text-xs text-zinc-500 mb-4">
              Confidence:{' '}
              <span className="text-white font-medium">
                {decision.confidence}%
              </span>
            </div>

            {decision.timingAdvice && (
              <div
                className={`text-xs px-3 py-2 rounded-lg ${
                  decision.timingAdvice.windowStatus === 'open'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : decision.timingAdvice.windowStatus === 'narrowing'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                }`}
              >
                {decision.timingAdvice.advice}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {decision.highlights.length > 0 && (
                <div>
                  <div className="text-xs text-emerald-400 mb-2 font-medium">
                    Highlights
                  </div>
                  <ul className="space-y-1">
                    {decision.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-zinc-400"
                      >
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {decision.concerns.length > 0 && (
                <div>
                  <div className="text-xs text-red-400 mb-2 font-medium">
                    Concerns
                  </div>
                  <ul className="space-y-1">
                    {decision.concerns.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-zinc-400"
                      >
                        <span className="text-red-500 mt-0.5">✗</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* price */}
        {priceEval && (
          <section
            className={`rounded-xl border p-4 ${
              priceEval.budgetLevel === 'low'
                ? 'border-red-500/40 bg-red-500/10'
                : priceEval.budgetLevel === 'high'
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-950/40'
            }`}
          >
            <h2 className="mb-4 text-sm font-semibold text-white">
              Price Evaluation
            </h2>

            <div className="space-y-3 text-sm text-zinc-300">
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
                      className={`text-base font-bold ${
                        priceEval.budgetLevel === 'low'
                          ? 'text-red-400'
                          : priceEval.budgetLevel === 'high'
                            ? 'text-emerald-400'
                            : 'text-white'
                      }`}
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
          </section>
        )}

        {/* Analysis */}
        {analysis && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Job Analysis
            </h2>

            <div className="space-y-3 text-sm text-zinc-300">
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
          </section>
        )}

        {/* Score */}
        {jobScore && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">Job Score</h2>

            <div className="space-y-3 text-sm text-zinc-300">
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
          </section>
        )}

        {/* competition */}
        {competition && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Competition Analysis
            </h2>

            <div className="space-y-3 text-sm text-zinc-300">
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
                <span className="text-zinc-500">Competition Level:</span>{' '}
                <span
                  className={
                    competition.competitionLevel === 'low'
                      ? 'text-emerald-400'
                      : competition.competitionLevel === 'medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {competition.competitionLevel}
                </span>
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
          </section>
        )}

        {/* Cover Letter */}
        {proposalContent && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Cover Letter</h2>

              <button
                onClick={() => handleCopy(proposalContent.coverLetter, 'cover')}
                className="rounded-md bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
              >
                {copied === 'cover' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {proposalContent.coverLetter}
            </div>
          </section>
        )}

        {/* Proposal */}
        {proposalContent && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Full Proposal
              </h2>

              <button
                onClick={() => handleCopy(proposalContent.proposal, 'proposal')}
                className="rounded-md bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
              >
                {copied === 'proposal' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-white">
              <ReactMarkdown>
                {formatResult(proposalContent.proposal)}
              </ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
