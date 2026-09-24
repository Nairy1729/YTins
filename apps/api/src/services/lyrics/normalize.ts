import type { LyricsLine } from '@reverie/contracts';

const SECTION =
  /^[[(]?\s*(intro|verse|pre-?chorus|chorus|hook|bridge|outro|refrain|interlude|instrumental|solo|breakdown|post-?chorus)\b[^)\]]*[)\]]?\s*$/i;

const ONLY_SYMBOLS = /^[^\p{L}\p{N}]+$/u;

export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^[-–—]\s*/, '')
    .trim();
}

export function isNoiseLine(text: string): boolean {
  if (text.length === 0) return true;
  if (SECTION.test(text)) return true;
  if (ONLY_SYMBOLS.test(text)) return true;
  return false;
}

/**
 * Repeated lyrics are legitimate, so we only drop entries that duplicate
 * both text and timestamp.
 */
export function normalizeLines(lines: LyricsLine[]): LyricsLine[] {
  const seen = new Set<string>();
  const out: LyricsLine[] = [];

  for (const line of lines) {
    const text = normalizeText(line.text);
    if (isNoiseLine(text)) continue;

    const key = String(line.startMs) + '|' + text;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ text: text.slice(0, 400), startMs: line.startMs });
  }

  return out;
}