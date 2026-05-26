import { useState } from 'react'

import ProposalForm from './features/proposal/components/ProposalForm'
import ProposalResult from './features/proposal/components/ProposalResult'

export default function App() {
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    setLoading(true)

    setTimeout(() => {
      setResult(`
Hello Client,

I am a senior frontend developer with strong experience in React, TypeScript, and AI-powered applications.

I can help you build a clean, scalable, and modern solution for your project.

My recent work includes:
- AI SaaS tools
- Dashboard systems
- Frontend architecture
- Tailwind UI systems

I would love to discuss your project further.

Best regards
      `)

      setLoading(false)
    }, 1500)
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
          <ProposalForm onGenerate={handleGenerate} />
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