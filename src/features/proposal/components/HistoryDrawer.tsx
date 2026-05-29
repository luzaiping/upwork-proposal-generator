import type { HistoryRecord } from '../../../types/history';

type Props = {
  open: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onSelect: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTitle(record: HistoryRecord): string {
  if (record.job.title) return record.job.title;
  return record.job.description.slice(0, 40) + '...';
}

export default function HistoryDrawer({
  open,
  onClose,
  records,
  onSelect,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* drawer */}
      <div className="fixed left-0 top-0 z-50 h-full w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">History</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {records.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              No history yet
            </div>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {records.map((record) => (
                <li
                  key={record.id}
                  className="group flex items-start justify-between gap-2 px-4 py-3 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => {
                    onSelect(record);
                    onClose();
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-200 truncate">
                      {getTitle(record)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {formatTime(record.savedAt)}
                    </div>
                    <div
                      className={`text-xs mt-1 font-medium ${
                        record.decision.verdict === 'apply'
                          ? 'text-emerald-400'
                          : record.decision.verdict === 'skip'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {record.decision.verdict.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 text-xs pt-1 cursor-p"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
