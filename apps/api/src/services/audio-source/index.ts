import { extractYouTubeVideoId } from '@reverie/contracts';
import { AppError } from '../../lib/app-error.js';
import { YouTubeAudioSource } from './youtube.adapter.js';
import type { AudioSource } from './types.js';

export type { AudioAsset, AudioSource } from './types.js';

export function resolveAudioSource(input: string): AudioSource {
  const videoId = extractYouTubeVideoId(input);

  if (videoId) return new YouTubeAudioSource(videoId);

  throw new AppError('INVALID_SOURCE_URL', 'Unsupported source: ' + input.slice(0, 120), {
    status: 400,
    userMessage: 'We do not recognise that link. Paste a YouTube video, Short or Music link.',
    recoverable: true,
  });
}