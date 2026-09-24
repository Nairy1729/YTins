import { z } from 'zod';

const VIDEO_ID = /^[\w-]{11}$/;

const ALLOWED_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
];

const PATH_PREFIXES = ['shorts', 'embed', 'live', 'v'];

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  if (value.length === 0) return null;
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : '[https://'+value);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.includes(host)) return null;

  const parts = url.pathname.split('/').filter((part) => part.length > 0);

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const id = parts[0];
    return id && VIDEO_ID.test(id) ? id : null;
  }

  const queryId = url.searchParams.get('v');
  if (queryId && VIDEO_ID.test(queryId)) return queryId;

  const head = parts[0];
  const tail = parts[1];
  if (head && tail && PATH_PREFIXES.includes(head) && VIDEO_ID.test(tail)) return tail;

  return null;
}

export function isYouTubeUrl(input: string): boolean {
  return extractYouTubeVideoId(input) !== null;
}

export function canonicalYouTubeUrl(videoId: string): string {
  return 'https://www.youtube.com/watch?v='+videoId;
}

export const youtubeVideoIdSchema = z.string().regex(VIDEO_ID, 'Invalid YouTube video id.');

export const youtubeUrlSchema = z.string().min(1).refine(isYouTubeUrl, {
  message: 'Enter a valid YouTube link.',
});