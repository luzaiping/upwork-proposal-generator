import { useState } from 'react'

import ProposalForm from './features/proposal/components/ProposalForm'
import ProposalResult from './features/proposal/components/ProposalResult'

import { generateProposal } from './services/ai'

import type {
  ProposalFormData,
  ProposalResultData,
} from './types/proposal'

export default function App() {
  const [loading, setLoading] = useState(false)

  const [result, setResult] =
    useState<ProposalResultData | null>(null)

  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

  const [form, setForm] = useState<ProposalFormData>({
    jobDescription: '',
    skills: '',
    tone: 'Professional',
  })

  const handleGenerate = async () => {
    const controller = new AbortController()

    setAbortController(controller)

    try {
      setLoading(true)

      const response = await generateProposal({
        ...form,
        signal: controller.signal,
      })

      setResult(response)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const handleStop = () => {
    abortController?.abort()
    setLoading(false)
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">

      <header className="h-14.25 flex items-center border-b border-zinc-800 px-6">
        <h1 className="text-xl font-semibold">
          AI Proposal Generator
        </h1>
      </header>

      <main className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">

        <section className="flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalForm
            onGenerate={handleGenerate}
            form={form}
            setForm={setForm}
          />
        </section>

        <section className="flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalResult
            result={result}
            loading={loading}
          />
        </section>

      </main>

      {loading && (
        <button
          onClick={handleStop}
          className="fixed bottom-6 right-6 rounded-full bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
        >
          Stop
        </button>
      )}
    </div>
  )
}