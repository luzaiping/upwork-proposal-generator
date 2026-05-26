type Props = {
  onGenerate: () => void
}

export default function ProposalForm({
  onGenerate,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Job Description
        </label>

        <textarea
          className="
            h-64
            w-full
            resize-none
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            p-4
            text-sm
            outline-none
            transition
            focus:border-zinc-500
          "
          placeholder="Paste job description..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Skills
        </label>

        <input
          className="
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            p-3
            text-sm
            outline-none
            focus:border-zinc-500
          "
          placeholder="React, TypeScript, Tailwind..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Tone
        </label>

        <select
          className="
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            p-3
            text-sm
            outline-none
            focus:border-zinc-500
          "
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Technical</option>
        </select>
      </div>

      <button
        onClick={onGenerate}
        className="
          mt-auto
          rounded-xl
          bg-white
          px-4
          py-3
          font-medium
          text-black
          transition
          hover:opacity-90
        "
      >
        Generate Proposal
      </button>
    </div>
  )
}