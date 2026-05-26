import { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

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

  const formatResult = (text: string) => {
    return text
      // 统一标题层级
      .replace(/###/g, '##')
      // 去掉多余空行
      .replace(/\n{3,}/g, '\n\n')
      // 修复 bullet 风格
      .replace(/^\s*-\s/gm, '- ')
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

      {/* markdown content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 text-sm leading-7 text-zinc-200"
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-lg font-bold mt-4 mb-2 text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold mt-3 mb-2 text-white">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-zinc-200 leading-7">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-3 space-y-1">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-zinc-300">
                {children}
              </li>
            ),
          }}
        >
           {formatResult(result)}
        </ReactMarkdown>

        {loading && result.length > 0 && (
          <span className="inline-block w-1 h-4 bg-emerald-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  )
}