import { useState } from 'react';

import ProposalForm from './features/proposal/components/ProposalForm';
import ProposalResult from './features/proposal/components/ProposalResult';
import { generateProposal } from './services/ai';
import { analyzeJob } from './services/analysis';

import type { ProposalFormData, ProposalContent } from './types/proposal';
import { scoreJob } from './services/scoring';
import type { JobScore } from './types/scoring';
import type { JobAnalysis } from './types/job';
import { estimateCompetition } from './services/competition';
import type { CompetitionEstimation } from './types/scoring';
import { mapFormToJob } from './utils/mapFormToJob';

export default function App() {
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  const [proposalContent, setProposalContent] =
    useState<ProposalContent | null>(null);

  const [jobScore, setJobScore] = useState<JobScore | null>(null);

  const [competition, setCompetition] = useState<CompetitionEstimation | null>(
    null,
  );

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const [form, setForm] = useState<ProposalFormData>({
    jobDescription: '',
    skills: '',
    tone: 'Professional',
  });

  const handleGenerate = async () => {
    const controller = new AbortController();

    setAbortController(controller);

    try {
      setLoading(true);
      setAnalysis(null);
      setJobScore(null);
      setCompetition(null);
      setProposalContent(null);

      const job = mapFormToJob(form);

      // 1. analysis
      const analysisResult = await analyzeJob(job);
      setAnalysis(analysisResult);

      // 2. score
      const score = scoreJob(analysisResult, job.description);
      setJobScore(score);

      // 3. competition
      const competitionResult = estimateCompetition(job.description);
      setCompetition(competitionResult);

      // 4. proposal
      await generateProposal({
        ...job,
        signal: controller.signal,
        onChunk: (content) => setProposalContent(content),
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // user stopped manually, do nothing
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    abortController?.abort();
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      <header className="h-14.25 flex items-center border-b border-zinc-800 px-6">
        <h1 className="text-xl font-semibold">AI Proposal Generator</h1>
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
            analysis={analysis}
            jobScore={jobScore}
            competition={competition}
            proposalContent={proposalContent}
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
  );
}
