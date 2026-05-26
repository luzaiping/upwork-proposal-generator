import { useRef, useEffect } from 'react'

type Props = {
  result: string
  loading: boolean
}

export default function ProposalResult({
  result,
  loading,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [result])

  if (!result && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        AI proposal will appear here
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* loading bar */}
      {loading && (
        <div className="mb-2 flex items-center gap-2 text-xs text-emerald-400 border-b border-zinc-800 pb-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
          Generating...
          {result.length > 0 && ` (${result.length} chars)`}
        </div>
      )}

      {/* scroll area */}
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