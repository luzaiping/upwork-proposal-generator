import { useRef, useState } from 'react';

import ProposalForm from './features/proposal/components/ProposalForm';
import ProposalResult from './features/proposal/components/ProposalResult';
import type { ProposalResultHandle } from './features/proposal/components/ProposalResult';
import { generateProposal } from './services/ai';
import { analyzeJob } from './services/analysis';

import type { ProposalFormData, ProposalContent } from './types/proposal';
import { scoreJob } from './services/scoring';
import type { JobScore } from './types/scoring';
import type { Job, JobAnalysis } from './types/job';
import { estimateCompetition } from './services/competition';
import type { CompetitionEstimation } from './types/scoring';
import { buildDecision } from './services/decision';
import type { DecisionSummary } from './types/scoring';
import { evaluatePrice } from './services/pricing';
import type { PriceEvaluation } from './types/job';
import { evaluateTiming } from './services/timing';
import { estimateConnects } from './services/connects';
import type { ConnectsEstimation } from './types/scoring';
import { loadHistory, saveHistory, deleteHistory } from './services/history';
import HistoryDrawer from './features/proposal/components/HistoryDrawer';
import type { HistoryRecord } from './types/history';
import { mapFormToJob } from './utils/mapFormToJob';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<
    'idle' | 'analyzing' | 'generating'
  >('idle');

  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [proposalContent, setProposalContent] =
    useState<ProposalContent | null>(null);
  const [jobScore, setJobScore] = useState<JobScore | null>(null);
  const [competition, setCompetition] = useState<CompetitionEstimation | null>(
    null,
  );
  const [decision, setDecision] = useState<DecisionSummary | null>(null);
  const [priceEval, setPriceEval] = useState<PriceEvaluation | null>(null);
  const [connectsEst, setConnectsEst] = useState<ConnectsEstimation | null>(
    null,
  );

  const proposalResultRef = useRef<ProposalContent | null>(null);
  const proposalResultPanelRef = useRef<ProposalResultHandle>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() =>
    loadHistory(),
  );

  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    let analysisResult: JobAnalysis | null = null;
    let score: JobScore | null = null;
    let competitionResult: CompetitionEstimation | null = null;
    let decisionResult: DecisionSummary | null = null;
    let priceResult: PriceEvaluation | null = null;
    let connectsResult: ConnectsEstimation | null = null;
    let proposalResult: ProposalContent | null = null;
    let job: Job | null = null;

    try {
      setLoading(true);
      setLoadingStep('analyzing');
      setAnalysis(null);
      setJobScore(null);
      setCompetition(null);
      setDecision(null);
      setPriceEval(null);
      setConnectsEst(null);
      setProposalContent(null);
      setError(null);
      proposalResultRef.current = null;

      job = mapFormToJob(form);

      // analysis
      analysisResult = await Promise.race([
        analyzeJob(job),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Analysis timeout')), 30000),
        ),
      ]);
      setAnalysis(analysisResult);
      setLoadingStep('generating');

      // score
      score = scoreJob(
        analysisResult,
        job.description,
        job.budget,
        job.clientHistory,
      );
      setJobScore(score);

      // competition
      competitionResult = estimateCompetition(job.description);
      setCompetition(competitionResult);

      // price
      priceResult = evaluatePrice(job, analysisResult);
      setPriceEval(priceResult);

      // decision
      decisionResult = buildDecision(
        analysisResult,
        score,
        competitionResult,
        evaluateTiming(job.jobPostedAt),
      );
      setDecision(decisionResult);

      // connects
      connectsResult = estimateConnects(
        analysisResult,
        score,
        competitionResult,
      );
      setConnectsEst(connectsResult);

      // proposal
      if (decisionResult.verdict === 'skip') {
        setShowSkipConfirm(true);
        return;
      }

      proposalResult = await generateProposal({
        ...job,
        signal: controller.signal,
        onChunk: (content) => { 
          setProposalContent(content);
          proposalResultRef.current = content;
        }
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // user stopped manually
      } else if (e instanceof Error && e.message === 'Analysis timeout') {
        setError('Analysis timed out, please try again.');
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Something went wrong, please try again.');
        console.error(e);
      }
    } finally {
      if (
        analysisResult &&
        score &&
        competitionResult &&
        decisionResult &&
        priceResult &&
        connectsResult &&
        proposalResult
      ) {
        const record = saveHistory({
          job,
          analysis: analysisResult,
          jobScore: score,
          competition: competitionResult,
          decision: decisionResult,
          priceEval: priceResult,
          connectsEst: connectsResult,
          proposalContent: proposalResult,
        });
        setHistoryRecords((prev) => [record, ...prev].slice(0, 50));
      }
      setLoading(false);
      setLoadingStep('idle');
    }
  };

  const handleForceGenerate = async () => {
    setShowSkipConfirm(false);
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    setLoadingStep('generating');
    try {
      const job = mapFormToJob(form);
      await generateProposal({
        ...job,
        signal: controller.signal,
        onChunk: (content) => {
          setProposalContent(content);
          proposalResultRef.current = content;
        },
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // user stopped
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
      setLoadingStep('idle');
    }
  };

  const handleSelectHistory = (record: HistoryRecord) => {
    setForm({
      jobDescription: record.job.description,
      skills: record.job.skills.join(', '),
      tone: record.job.tone,
      jobTitle: record.job.title,
      budgetType: record.job.budget?.type,
      budgetAmount:
        record.job.budget?.type === 'fixed'
          ? String(record.job.budget.amount)
          : undefined,
      budgetMin:
        record.job.budget?.type === 'hourly'
          ? String(record.job.budget.min)
          : undefined,
      budgetMax:
        record.job.budget?.type === 'hourly'
          ? String(record.job.budget.max)
          : undefined,
      clientTotalJobs: record.job.clientHistory
        ? String(record.job.clientHistory.totalJobs)
        : undefined,
      clientHireRate: record.job.clientHistory
        ? String(record.job.clientHistory.hireRate)
        : undefined,
      clientAvgRating: record.job.clientHistory
        ? String(record.job.clientHistory.avgRating)
        : undefined,
      targetHourlyRate: record.job.targetHourlyRate
        ? String(record.job.targetHourlyRate)
        : undefined,
      jobPostedAt: record.job.jobPostedAt,
    });
    setAnalysis(record.analysis);
    setJobScore(record.jobScore);
    setCompetition(record.competition);
    setDecision(record.decision);
    setPriceEval(record.priceEval);
    setConnectsEst(record.connectsEst);
    setProposalContent(record.proposalContent);
    proposalResultRef.current = record.proposalContent;
    proposalResultPanelRef.current?.scrollToTop();
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryRecords(deleteHistory(id));
  };

  const handleStop = () => {
    abortController?.abort();
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      <header className="h-14.25 flex items-center border-b border-zinc-800 px-6">
        <header className="h-14.25 flex items-center border-b border-zinc-800 px-6 gap-4">
          <button
            onClick={() => setHistoryOpen(true)}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ☰ History
          </button>
          <h1 className="text-xl font-semibold">AI Proposal Generator</h1>
        </header>
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
            decision={decision}
            priceEval={priceEval}
            connectsEst={connectsEst}
            proposalContent={proposalContent}
            error={error}
            loading={loading}
            loadingStep={loadingStep}
            ref={proposalResultPanelRef}
          />
        </section>
      </main>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        records={historyRecords}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />

      {loading && (
        <button
          onClick={handleStop}
          className="fixed bottom-6 right-6 rounded-full bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
        >
          Stop
        </button>
      )}

      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 w-80 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Not Recommended
            </h3>
            <p className="text-sm text-zinc-400">
              The analysis suggests skipping this job. Do you still want to
              generate a proposal?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 rounded-xl border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleForceGenerate}
                className="flex-1 rounded-xl bg-white py-2 text-sm font-medium text-black"
              >
                Generate Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
