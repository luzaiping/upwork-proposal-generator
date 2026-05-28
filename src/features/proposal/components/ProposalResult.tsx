import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import type { ProposalContent } from '../../../types/proposal';
import type { JobAnalysis } from '../../../types/job';

type Props = {
  analysis: JobAnalysis | null;
  proposalContent: ProposalContent | null;
  loading: boolean;
};

export default function ProposalResult({
  analysis,
  proposalContent,
  loading,
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
        <div className="mb-3 text-sm text-emerald-400">
          Generating proposal...
        </div>
      )}

      {/* content */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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
