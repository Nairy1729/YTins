import { describe, expect, it } from 'vitest';
import { cleanTitle, guessArtistAndTitle } from './title.js';
import { parseLrc } from './lrc.js';
import { normalizeLines, isNoiseLine } from './normalize.js';

describe('cleanTitle', () => {
  it('strips bracketed and parenthesised noise', () => {
    expect(cleanTitle('Artist - Song (Official Video) [4K]')).toBe('Artist - Song');
  });

  it('keeps meaningful parentheses', () => {
    expect(cleanTitle('Song (Acoustic)')).toBe('Song (Acoustic)');
  });

  it('trims trailing separators', () => {
    expect(cleanTitle('Song -')).toBe('Song');
  });
});

describe('guessArtistAndTitle', () => {
  it('splits on a dash', () => {
    expect(guessArtistAndTitle('Radiohead - Creep (Official Video)', null)).toEqual({
      artist: 'Radiohead',
      title: 'Creep',
    });
  });

  it('falls back to the uploader', () => {
    expect(guessArtistAndTitle('Creep', 'Radiohead - Topic')).toEqual({
      artist: 'Radiohead',
      title: 'Creep',
    });
  });

  it('handles no artist at all', () => {
    expect(guessArtistAndTitle('Creep', null)).toEqual({ artist: null, title: 'Creep' });
  });
});

describe('parseLrc', () => {
  it('parses timestamps into milliseconds', () => {
    const result = parseLrc('[00:12.34]Hello\n[01:05.00]World');
    expect(result).toEqual([
      { text: 'Hello', startMs: 12340 },
      { text: 'World', startMs: 65000 },
    ]);
  });

  it('expands multiple timestamps on one line', () => {
    expect(parseLrc('[00:10.00][00:20.00]Repeat')).toHaveLength(2);
  });

  it('skips metadata tags and blank lines', () => {
    expect(parseLrc('[ar:Artist]\n[ti:Title]\n[00:01.00]Real')).toEqual([
      { text: 'Real', startMs: 1000 },
    ]);
  });

  it('sorts out of order timestamps', () => {
    const result = parseLrc('[00:20.00]Second\n[00:10.00]First');
    expect(result[0]?.text).toBe('First');
  });
});

describe('isNoiseLine', () => {
  it('detects section markers', () => {
    expect(isNoiseLine('[Chorus]')).toBe(true);
    expect(isNoiseLine('Verse 1')).toBe(true);
  });

  it('detects symbol only lines', () => {
    expect(isNoiseLine('***')).toBe(true);
  });

  it('keeps real lyrics', () => {
    expect(isNoiseLine('I still remember your face')).toBe(false);
  });
});

describe('normalizeLines', () => {
  it('removes noise and collapses whitespace', () => {
    const result = normalizeLines([
      { text: '[Chorus]', startMs: 0 },
      { text: '  I  still   remember ', startMs: 1000 },
      { text: '', startMs: 2000 },
    ]);
    expect(result).toEqual([{ text: 'I still remember', startMs: 1000 }]);
  });

  it('keeps legitimate repeated lyrics', () => {
    const result = normalizeLines([
      { text: 'na na na', startMs: 1000 },
      { text: 'na na na', startMs: 2000 },
    ]);
    expect(result).toHaveLength(2);
  });

  it('drops exact duplicates', () => {
    const result = normalizeLines([
      { text: 'same', startMs: 1000 },
      { text: 'same', startMs: 1000 },
    ]);
    expect(result).toHaveLength(1);
  });
});