import { Router } from 'express';
import { resolveAudioSource } from '../services/audio-source/index.js';
import { fetchLyricsForTrack } from '../services/lyrics/index.js';
import { buildTimeline } from '../services/timeline/index.js';

export const debugRouter: Router = Router();

debugRouter.get('/probe', (req, res, next) => {
  const source = resolveAudioSource(String(req.query.url ?? ''));
  source.probe().then((track) => res.json(track), next);
});

debugRouter.get('/audio', (req, res, next) => {
  const source = resolveAudioSource(String(req.query.url ?? ''));
  source.fetchAudio().then((asset) => res.json(asset), next);
});

debugRouter.get('/lyrics', (req, res, next) => {
  const source = resolveAudioSource(String(req.query.url ?? ''));
  source
    .probe()
    .then((track) => fetchLyricsForTrack(track))
    .then((lyrics) => res.json(lyrics), next)
    .catch(next);
});

debugRouter.get('/timeline', (req, res, next) => {
  const source = resolveAudioSource(String(req.query.url ?? ''));
  source
    .probe()
    .then(async (track) => {
      const lyrics = await fetchLyricsForTrack(track);
      const timeline = buildTimeline(lyrics, track.durationSeconds);
      return { ...timeline, lines: timeline.lines.slice(0, 8) };
    })
    .then((result) => res.json(result), next)
    .catch(next);
});