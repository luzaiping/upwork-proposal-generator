import type { HistoryRecord } from '../types/history';

const STORAGE_KEY = 'upwork_proposal_history';
const MAX_RECORDS = 50;

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(record: Omit<HistoryRecord, 'id' | 'savedAt'>): HistoryRecord {
  const records = loadHistory();
  const newRecord: HistoryRecord = {
    ...record,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...records].slice(0, MAX_RECORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
}

export function deleteHistory(id: string): HistoryRecord[] {
  const records = loadHistory().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
}