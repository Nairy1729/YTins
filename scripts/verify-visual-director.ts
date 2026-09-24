import { directScenes } from '../apps/api/src/services/visual-director/index.js';
import { scenePlanSchema } from '../packages/contracts/src/index.js';

const refTrack = {
  sourceId: 'RQbnPl5E5No',
  sourceKind: 'youtube' as const,
  title: 'Tere Bina Na Guzara',
  artist: 'Satinder Sartaaj & Neeru Bajwa',
  durationSeconds: 215,
  thumbnailUrl: null,
  webUrl: 'https://youtu.be/RQbnPl5E5No',
};

const refLyrics = {
  source: 'lrclib' as const,
  synced: true,
  instrumental: false,
  lineCount: 4,
  matchedTitle: 'Tere Bina Na Guzara',
  matchedArtist: 'Satinder Sartaaj',
  lines: [
    { text: 'Tere bina na guzara ae', startMs: 25000 },
    { text: 'Dil kalla te rona aave', startMs: 31000 },
    { text: 'Akhiyan ch barsaat ae sajjna', startMs: 38000 },
    { text: 'Mud aaja pardesiya ve', startMs: 44000 },
  ],
};

const refTimeline = {
  kind: 'synced' as const,
  lineCount: 4,
  segmentLineCount: 4,
  totalDurationMs: 215000,
  segment: {
    startMs: 24000,
    endMs: 56000,
    durationMs: 32000,
  },
  lines: [
    { text: 'Tere bina na guzara ae', startMs: 25000, endMs: 30000, durationMs: 5000 },
    { text: 'Dil kalla te rona aave', startMs: 31000, endMs: 37000, durationMs: 6000 },
    { text: 'Akhiyan ch barsaat ae sajjna', startMs: 38000, endMs: 43000, durationMs: 5000 },
    { text: 'Mud aaja pardesiya ve', startMs: 44000, endMs: 52000, durationMs: 8000 },
  ],
  gaps: [],
};

async function main() {
  const styles = [
    'pen-ink',
    'minimal-type',
    'pencil-sketch',
    'graph-abstract',
    'notebook',
    'cinematic',
  ] as const;

  for (const style of styles) {
    const res = await directScenes({
      track: refTrack,
      lyrics: refLyrics,
      timeline: refTimeline,
      styleId: style,
      seed: 42,
    });

    console.log(`=== STYLE: ${style} ===`);
    console.log(`Provider: ${res.provider}`);
    console.log(`Dominant Emotion: ${res.analysis.dominantEmotion} (Tags: ${res.analysis.tags.join(', ')})`);
    console.log(`Scenes generated: ${res.scenePlan.scenes.length}`);

    res.scenePlan.scenes.forEach((s, idx) => {
      const motifList = s.motifs.map((m) => `${m.ref}@(${m.x},${m.y})`).join(', ');
      console.log(
        `  Scene ${idx + 1}: ${s.id} | ${s.startMs}ms - ${s.startMs + s.durationMs}ms | emotion="${s.emotion}" | lyric="${s.lyric?.text}" | motifs=[${motifList}] | camera=${s.camera.move} | transition=${s.transitionOut}`,
      );
    });

    const parsed = scenePlanSchema.safeParse(res.scenePlan);
    console.log(`Schema valid: ${parsed.success}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
