export interface ParsedLrcLine {
  text: string;
  startMs: number;
}

function isDigits(value: string): boolean {
  if (value.length === 0) return false;
  for (const char of value) {
    if (char < '0' || char > '9') return false;
  }
  return true;
}

/** Parses "mm:ss.xx" or "mm:ss" into milliseconds. Returns null for metadata tags. */
function parseStamp(token: string): number | null {
  const firstColon = token.indexOf(':');
  if (firstColon <= 0) return null;

  const minutePart = token.slice(0, firstColon);
  const remainder = token.slice(firstColon + 1);

  let secondPart = remainder;
  let fractionPart = '0';

  const dot = remainder.indexOf('.');
  const colon = remainder.indexOf(':');
  const splitAt = dot >= 0 ? dot : colon;

  if (splitAt >= 0) {
    secondPart = remainder.slice(0, splitAt);
    fractionPart = remainder.slice(splitAt + 1);
  }

  if (!isDigits(minutePart) || !isDigits(secondPart) || !isDigits(fractionPart)) return null;

  const minutes = Number(minutePart);
  const seconds = Number(secondPart);
  const fraction = Number((fractionPart + '000').slice(0, 3));

  if (seconds > 59) return null;

  return minutes * 60000 + seconds * 1000 + fraction;
}

function splitLines(content: string): string[] {
  return content.split('\n').map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
}

/** Parses standard LRC. Supports multiple timestamps on a single line. */
export function parseLrc(content: string): ParsedLrcLine[] {
  const out: ParsedLrcLine[] = [];

  for (const raw of splitLines(content)) {
    let index = 0;
    const stamps: number[] = [];

    while (index < raw.length && raw[index] === '[') {
      const close = raw.indexOf(']', index + 1);
      if (close === -1) break;

      const stamp = parseStamp(raw.slice(index + 1, close));
      if (stamp !== null) stamps.push(stamp);

      index = close + 1;
    }

    const text = raw.slice(index).trim();
    if (stamps.length === 0 || text.length === 0) continue;

    for (const startMs of stamps) out.push({ text, startMs });
  }

  return out.sort((a, b) => a.startMs - b.startMs);
}

export function parsePlain(content: string): string[] {
  return splitLines(content);
}