import { useState } from 'react';
import type { ProposalFormData } from '../../../types/proposal';

type Props = {
  onGenerate: () => void;
  form: ProposalFormData;
  setForm: (v: ProposalFormData) => void;
};

export default function ProposalForm({ onGenerate, form, setForm }: Props) {
  // 组件内加
  const [showAdvanced, setShowAdvanced] = useState(false);

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
          <label className="mb-2 block text-sm text-zinc-400">Skills</label>

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
          <label className="mb-2 block text-sm text-zinc-400">Tone</label>

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

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span>{showAdvanced ? '▾' : '▸'}</span>
            Advanced (Optional)
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Job Title
                </label>
                <input
                  value={form.jobTitle || ''}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  placeholder="e.g. React Developer for SaaS Dashboard"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Job Posted At
                </label>
                <input
                  value={form.jobPostedAt || ''}
                  onChange={(e) =>
                    setForm({ ...form, jobPostedAt: e.target.value })
                  }
                  type="datetime-local"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Budget
                </label>
                <select
                  value={form.budgetType || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      budgetType:
                        (e.target.value as 'fixed' | 'hourly') || undefined,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none mb-2"
                >
                  <option value="">Select budget type</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>

                {form.budgetType === 'fixed' && (
                  <input
                    value={form.budgetAmount || ''}
                    onChange={(e) =>
                      setForm({ ...form, budgetAmount: e.target.value })
                    }
                    placeholder="Amount (USD)"
                    type="number"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                  />
                )}

                {form.budgetType === 'hourly' && (
                  <div className="flex gap-2">
                    <input
                      value={form.budgetMin || ''}
                      onChange={(e) =>
                        setForm({ ...form, budgetMin: e.target.value })
                      }
                      placeholder="Min (USD)"
                      type="number"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                    />
                    <input
                      value={form.budgetMax || ''}
                      onChange={(e) =>
                        setForm({ ...form, budgetMax: e.target.value })
                      }
                      placeholder="Max (USD)"
                      type="number"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Client History
                </label>
                <div className="space-y-2">
                  <input
                    value={form.clientTotalJobs || ''}
                    onChange={(e) =>
                      setForm({ ...form, clientTotalJobs: e.target.value })
                    }
                    placeholder="Total jobs posted"
                    type="number"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                  />
                  <input
                    value={form.clientHireRate || ''}
                    onChange={(e) =>
                      setForm({ ...form, clientHireRate: e.target.value })
                    }
                    placeholder="Hire rate (%)"
                    type="number"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                  />
                  <input
                    value={form.clientAvgRating || ''}
                    onChange={(e) =>
                      setForm({ ...form, clientAvgRating: e.target.value })
                    }
                    placeholder="Avg rating (0-5)"
                    type="number"
                    step="0.1"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Target Hourly Rate (USD)
                </label>
                <input
                  value={form.targetHourlyRate || ''}
                  onChange={(e) =>
                    setForm({ ...form, targetHourlyRate: e.target.value })
                  }
                  placeholder="Default: $40/hr"
                  type="number"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none"
                />
              </div>
            </div>
          )}
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
  );
}
