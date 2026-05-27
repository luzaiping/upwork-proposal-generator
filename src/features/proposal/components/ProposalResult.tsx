import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { ProposalResultData } from '../../../types/proposal'

type Props = {
  result: ProposalResultData | null
  loading: boolean
}

export default function ProposalResult({
  result,
  loading,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (
    text: string,
    type: string
  ) => {
    if (!text) return

    await navigator.clipboard.writeText(text)

    setCopied(type)

    setTimeout(() => {
      setCopied(null)
    }, 1500)
  }

  const formatResult = (text: string) => {
    return text
      .replace(/###/g, '##')
      .replace(/\n{3,}/g, '\n\n')
  }

  if (!result && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        AI proposal will appear here
      </div>
    )
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
      {result && (
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">

          {/* Cover Letter */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="mb-3 flex items-center justify-between">

              <h2 className="text-sm font-semibold text-white">
                Cover Letter
              </h2>

              <button
                onClick={() =>
                  handleCopy(
                    result.coverLetter,
                    'cover'
                  )
                }
                className="rounded-md bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
              >
                {copied === 'cover'
                  ? 'Copied'
                  : 'Copy'}
              </button>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {result.coverLetter}
            </div>
          </section>

          {/* Proposal */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">

            <div className="mb-3 flex items-center justify-between">

              <h2 className="text-sm font-semibold text-white">
                Full Proposal
              </h2>

              <button
                onClick={() =>
                  handleCopy(
                    result.proposal,
                    'proposal'
                  )
                }
                className="rounded-md bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
              >
                {copied === 'proposal'
                  ? 'Copied'
                  : 'Copy'}
              </button>
            </div>

            <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-white">

              <ReactMarkdown>
                {formatResult(result.proposal)}
              </ReactMarkdown>

            </div>
          </section>

        </div>
      )}
    </div>
  )
}