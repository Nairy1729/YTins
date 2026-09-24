import type { Track } from '@reverie/contracts';

export interface AudioAsset {
  sourceId: string;
  filePath: string;
  format: string;
  bytes: number;
}

/**
 * Every ingestion route implements this. YouTube today, uploads and
 * licensed catalogues later, without touching the pipeline.
 */
export interface AudioSource {
  readonly kind: 'youtube' | 'upload';
  readonly sourceId: string;
  probe(): Promise<Track>;
  fetchAudio(): Promise<AudioAsset>;
}