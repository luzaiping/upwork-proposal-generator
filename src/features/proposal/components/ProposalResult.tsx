type Props = {
  result: string
  loading: boolean
}

export default function ProposalResult({
  result,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="text-zinc-400">
        Generating proposal...
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        AI proposal will appear here
      </div>
    )
  }

  return (
    <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
      {result}
    </div>
  )
}