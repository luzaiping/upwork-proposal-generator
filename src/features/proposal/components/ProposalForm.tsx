import type { ProposalFormData } from '../../../types/proposal'

type Props = {
  onGenerate: () => void
  form: ProposalFormData
  setForm: (v: ProposalFormData) => void
}

export default function ProposalForm({
  onGenerate,
  form,
  setForm,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">

      {/* 可滚动区域 */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Job Description
          </label>

          <textarea
            value={form.jobDescription}
            onChange={(e) =>
              setForm({
                ...form,
                jobDescription: e.target.value,
              })
            }
            className="h-56 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Skills
          </label>

          <input
            value={form.skills}
            onChange={(e) =>
              setForm({
                ...form,
                skills: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Tone
          </label>

          <select
            value={form.tone}
            onChange={(e) =>
              setForm({
                ...form,
                tone: e.target.value as ProposalFormData['tone'],
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
          >
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

      </div>

      {/* 固定按钮（不会被挤下去） */}
      <button
        onClick={onGenerate}
        className="mt-auto rounded-xl bg-white px-4 py-3 font-medium text-black"
      >
        Generate Proposal
      </button>

    </div>
  )
}