import { useState } from 'react'

import ProposalForm from './features/proposal/components/ProposalForm'
import ProposalResult from './features/proposal/components/ProposalResult'

import { generateProposalStream } from './services/ai'
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

      await generateProposalStream({
        ...form,
        onDelta: (chunk) => {
          setResult((prev) => prev + chunk)
        },
      })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      setResult('Error: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header（固定高度） */}
      <header className="h-14.25 flex items-center border-b border-zinc-800 px-6">
        <h1 className="text-xl font-semibold">
          AI Proposal Generator
        </h1>
      </header>

      {/* Main：关键修复点 */}
      <main className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
        
        {/* Left Panel */}
        <section className="flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalForm
            onGenerate={handleGenerate}
            form={form}
            setForm={setForm}
          />
        </section>

        {/* Right Panel */}
        <section className="flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <ProposalResult
            result={result}
            loading={loading}
          />
        </section>

      </main>
    </div>
  )
}