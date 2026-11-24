import type { PinRecord } from '../shared/types.ts';
import { announcePins, type Host } from './api.ts';

/** FNV-1a, base 36: storage keys stay short and never contain the path itself. */
export const hashPath = (value: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 0x01000193);
  return (hash >>> 0).toString(36);
};

/** One key per canonical checkout directory, so sibling worktrees never share pins. */
export const pinKey = (directory: string): string => `pins:v1:${hashPath(directory)}`;

const MAX_PINS = 40;

export const readRecord = (value: unknown, directory: string): string[] | null => {
  if (value === undefined) return [];
  const record = value as Partial<PinRecord> | null;
  if (!record || record.v !== 1 || !Array.isArray(record.tasks)) return null;
  // A hash collision or a moved checkout: this record belongs to another directory.
  if (record.directory !== directory) return [];
  return record.tasks.filter((task): task is string => typeof task === 'string' && task.length > 0 && task.length <= 200).slice(0, MAX_PINS);
};

/**
 * Pins live in extension storage on the connected server: task names per
 * checkout, nothing else. Writes are serialized per frame; other frames hear
 * about them through the service's `pins` event and re-read.
 */
export class PinStore {
  private chain: Promise<unknown> = Promise.resolve();
  constructor(private readonly host: Host) {}

  async read(directory: string): Promise<{ ok: true; pins: string[] } | { ok: false; message: string }> {
    try {
      const pins = readRecord(await this.host.storage.get(pinKey(directory)), directory);
      return pins ? { ok: true, pins } : { ok: false, message: 'Saved pins for this checkout are unreadable.' };
    } catch {
      return { ok: false, message: 'Could not read pins from extension storage.' };
    }
  }

  update(directory: string, change: (pins: string[]) => string[]): Promise<string[]> {
    const next = this.chain.then(async () => {
      const current = await this.read(directory);
      if (!current.ok) throw new Error(current.message);
      const pins = [...new Set(change(current.pins))].slice(0, MAX_PINS);
      if (pins.length) await this.host.storage.set(pinKey(directory), { v: 1, directory, tasks: pins } satisfies PinRecord);
      else await this.host.storage.delete(pinKey(directory));
      announcePins(this.host, directory);
      return pins;
    });
    this.chain = next.catch(() => undefined);
    return next;
  }

  toggle(directory: string, task: string): Promise<string[]> {
    return this.update(directory, (pins) => (pins.includes(task) ? pins.filter((pin) => pin !== task) : [...pins, task]));
  }

  remove(directory: string, task: string): Promise<string[]> {
    return this.update(directory, (pins) => pins.filter((pin) => pin !== task));
  }
}
