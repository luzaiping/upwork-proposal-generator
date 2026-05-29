import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import type { ProposalContent } from '../../../types/proposal';
import type { JobAnalysis } from '../../../types/job';
import type { JobScore } from '../../../types/scoring';
import type { CompetitionEstimation } from '../../../types/scoring';
import type { PriceEvaluation } from '../../../types/job';
import type { DecisionSummary } from '../../../types/scoring';
import type { ConnectsEstimation } from '../../../types/scoring';
import AnalysisAccordion from './AnalysisAccordion';

type Props = {
  analysis: JobAnalysis | null;
  jobScore: JobScore | null;
  competition: CompetitionEstimation | null;
  decision: DecisionSummary | null;
  priceEval: PriceEvaluation | null;
  connectsEst: ConnectsEstimation | null;
  proposalContent: ProposalContent | null;
  error: string | null;
  loading: boolean;
  loadingStep: 'idle' | 'analyzing' | 'generating';
};

export default function ProposalResult({
  analysis,
  jobScore,
  competition,
  decision,
  priceEval,
  connectsEst,
  proposalContent,
  error,
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

  if (!analysis && !proposalContent && !loading && !error) {
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

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* 1. Decision */}
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

            <div className="text-xs text-zinc-500 mb-3">
              Confidence:{' '}
              <span className="text-white font-medium">
                {decision.confidence}%
              </span>
            </div>

            {decision.timingAdvice && (
              <div
                className={`text-xs px-3 py-2 rounded-lg mb-3 ${
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

            {connectsEst && (
              <div
                className={`text-xs px-3 py-2 rounded-lg mb-3 ${
                  connectsEst.worthSpending
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                <span className="font-medium">
                  Est. Connects: {connectsEst.estimatedConnects}
                </span>
                {' — '}
                {connectsEst.reason}
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

        {/* 2. Cover Letter */}
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

        {/* 3. Full Proposal */}
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

        {/* 4. Analysis Details Accordion */}
        {(analysis || jobScore || competition || priceEval) && (
          <AnalysisAccordion
            analysis={analysis}
            jobScore={jobScore}
            competition={competition}
            priceEval={priceEval}
          />
        )}
      </div>
    </div>
  );
}
