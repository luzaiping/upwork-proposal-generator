export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold">
          AI Proposal Generator
        </h1>
      </header>

      <main className="grid grid-cols-2 gap-6 p-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          LEFT
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          RIGHT
        </section>
      </main>
    </div>
  )
}