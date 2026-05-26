import { useState } from 'react'

import ProposalForm from './features/proposal/components/ProposalForm'
import ProposalResult from './features/proposal/components/ProposalResult'

import { generateProposal } from './services/ai'
import type { ProposalFormData } from './types/proposal'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const [form, setForm] = useState<ProposalFormData>({
    jobDescription: '',
    skills: '',
    tone: 'Professional',
  })

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setResult('')

      const output = await generateProposal(form)

      setResult(output)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setResult('Error: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold">
          AI Proposal Generator
        </h1>
      </header>

      <main className="grid grid-cols-2 gap-6 p-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalForm
            onGenerate={handleGenerate}
            form={form}
            setForm={setForm}
          />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalResult
            result={result}
            loading={loading}
          />
        </section>
      </main>
    </div>
  )
}