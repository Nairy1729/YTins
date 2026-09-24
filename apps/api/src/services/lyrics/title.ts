const NOISE_WORDS = [
  'official video',
  'official music video',
  'official audio',
  'official lyric video',
  'lyric video',
  'with lyrics',
  'lyrics',
  'official',
  'audio',
  'video',
  'visualizer',
  'remastered',
  'remaster',
  'explicit',
  'clean version',
  'music video',
  'free download',
  'full song',
  'hd',
  'hq',
  '4k',
  '8k',
  'mv',
];

/** Terms that indicate an altered version, so duration will not match the original. */
const MODIFIERS = [
  'lofi',
  'lo-fi',
  'slowed',
  'reverb',
  'nightcore',
  'sped up',
  'speed up',
  'bass boosted',
  '8d audio',
  'remix',
  'mashup',
  'cover',
  'karaoke',
  'unplugged',
  'chopped',
  'refix',
  'flip',
  'extended',
];

const TRAILING_SEPARATORS = ['-', '|', '\u2022', '\u00b7', '\u2013', '\u2014', ',', '+'];
const SEPARATORS = [' - ', ' \u2013 ', ' \u2014 '];

function stripSegments(
  input: string,
  open: string,
  close: string,
  shouldRemove: (inner: string) => boolean,
): string {
  let out = '';
  let index = 0;

  while (index < input.length) {
    if (input[index] === open) {
      const end = input.indexOf(close, index + 1);
      if (end === -1) {
        out += input.slice(index);
        break;
      }
      const inner = input.slice(index + 1, end);
      out += shouldRemove(inner) ? ' ' : input.slice(index, end + 1);
      index = end + 1;
      continue;
    }
    out += input[index];
    index += 1;
  }

  return out;
}

function collapseSpaces(input: string): string {
  return input
    .split(' ')
    .filter((part) => part.length > 0)
    .join(' ');
}

function trimSeparators(input: string): string {
  let out = input.trim();
  while (out.length > 0 && TRAILING_SEPARATORS.includes(out[out.length - 1] ?? '')) {
    out = out.slice(0, -1).trim();
  }
  while (out.length > 0 && TRAILING_SEPARATORS.includes(out[0] ?? '')) {
    out = out.slice(1).trim();
  }
  return out;
}

function containsAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase();
  return needles.some((needle) => lower.includes(needle));
}

export function cleanTitle(raw: string): string {
  let out = stripSegments(raw, '[', ']', () => true);
  out = stripSegments(out, '(', ')', (inner) => containsAny(inner, NOISE_WORDS));
  return trimSeparators(collapseSpaces(out.trim()));
}

export function isModifiedUpload(rawTitle: string): boolean {
  return containsAny(rawTitle, MODIFIERS);
}

/** Removes version modifiers, including whole parenthesised groups containing them. */
export function stripModifiers(input: string): string {
  let out = stripSegments(input, '(', ')', (inner) => containsAny(inner, MODIFIERS));

  for (const modifier of MODIFIERS) {
    let lower = out.toLowerCase();
    let index = lower.indexOf(modifier);
    while (index !== -1) {
      out = out.slice(0, index) + ' ' + out.slice(index + modifier.length);
      lower = out.toLowerCase();
      index = lower.indexOf(modifier);
    }
  }

  return trimSeparators(collapseSpaces(out.trim()));
}

export interface TitleGuess {
  title: string;
  artist: string | null;
}

function stripTopicSuffix(name: string): string {
  const lower = name.toLowerCase();
  const index = lower.lastIndexOf('- topic');
  if (index > 0) return name.slice(0, index).trim();
  return name.trim();
}

export function guessArtistAndTitle(rawTitle: string, uploader: string | null): TitleGuess {
  const candidates = buildSearchCandidates(rawTitle, uploader);
  const first = candidates[0];
  if (first) return first;
  return { title: cleanTitle(rawTitle), artist: null };
}

/**
 * YouTube titles are unreliable, so we produce several plausible readings
 * and let the lyrics provider try each in turn.
 */
export function buildSearchCandidates(rawTitle: string, uploader: string | null): TitleGuess[] {
  const cleaned = cleanTitle(rawTitle);
  const segments = cleaned
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const head = segments[0] ?? cleaned;
  const candidates: TitleGuess[] = [];

  const push = (rawTitleText: string, rawArtistText: string | null): void => {
    const title = stripModifiers(rawTitleText);
    const artistClean = rawArtistText ? stripModifiers(rawArtistText) : '';
    const artist = artistClean.length > 1 ? artistClean : null;

    if (title.length < 2) return;

    const key = title.toLowerCase() + '|' + (artist ?? '').toLowerCase();
    if (candidates.some((c) => c.title.toLowerCase() + '|' + (c.artist ?? '').toLowerCase() === key)) {
      return;
    }
    candidates.push({ title, artist });
  };

  for (const separator of SEPARATORS) {
    const index = head.indexOf(separator);
    if (index > 0) {
      const left = head.slice(0, index).trim();
      const right = head.slice(index + separator.length).trim();
            // "Artist - Title" is the common convention, so try it first.
      push(right, left);
      push(left, right);
      break;
    }
  }

  for (const segment of segments.slice(1)) push(head, segment);

  push(head, uploader ? stripTopicSuffix(uploader) : null);
  push(head, null);

  return candidates.slice(0, 6);
}