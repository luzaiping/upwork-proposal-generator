import { useRef, useEffect, useState } from 'react'

type Props = {
  result: string
  loading: boolean
}

export default function ProposalResult({
  result,
  loading,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [result])

  const handleCopy = async () => {
    if (!result) return

    await navigator.clipboard.writeText(result)

    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!result && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        AI proposal will appear here
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden relative">

      {/* header */}
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-2">
        <span className="text-xs text-zinc-400">
          Generated Proposal
        </span>

        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 transition"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* loading */}
      {loading && (
        <div className="mb-2 text-xs text-emerald-400">
          Generating...
          {result.length > 0 && ` (${result.length} chars)`}
        </div>
      )}

      {/* content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-zinc-200 pr-2"
      >
        {result}

        {loading && result.length > 0 && (
          <span className="inline-block w-1 h-4 bg-emerald-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  )
}