export interface NotebookPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  accent?: boolean;
}

export function getNotebookMotif(ref: string): NotebookPathDef[] {
  switch (ref) {
    case 'margin-star-doodle':
      return [
        // Star outline
        { d: 'M 100 35 L 115 80 L 165 80 L 125 110 L 140 160 L 100 130 L 60 160 L 75 110 L 35 80 L 85 80 Z', length: 420, strokeWidth: 2 },
        // Secondary playful scribble loop
        { d: 'M 98 42 L 110 78 L 155 78 L 120 105 L 132 150 L 98 125 L 68 150 L 80 105 L 45 78 L 90 78 Z', length: 380, strokeWidth: 1.2, accent: true },
      ];

    case 'music-note-doodle':
    case 'sound-ripples':
      return [
        // First note head & stem
        { d: 'M 65 145 C 50 145, 45 158, 55 168 C 65 178, 80 172, 80 160 L 80 80', length: 140, strokeWidth: 2.2 },
        // Second note head & stem
        { d: 'M 135 130 C 120 130, 115 143, 125 153 C 135 163, 150 157, 150 145 L 150 65', length: 140, strokeWidth: 2.2 },
        // Connecting eighth beam
        { d: 'M 80 80 C 105 70, 125 60, 150 65', length: 75, strokeWidth: 3.5, accent: true },
        // Music vibrations
        { d: 'M 160 55 C 168 62, 172 75, 168 85', length: 35, strokeWidth: 1.5 },
      ];

    case 'arrow-scribble':
      return [
        // Sinuous curved shaft
        { d: 'M 40 160 C 60 140, 80 80, 150 60', length: 160, strokeWidth: 2.2 },
        // Arrowhead
        { d: 'M 130 50 L 150 60 L 140 80', length: 45, strokeWidth: 2.2, accent: true },
      ];

    case 'tape-strip':
      return [
        // Jagged washi tape borders
        { d: 'M 35 80 L 40 75 L 35 70 L 40 65 L 160 65 L 155 70 L 160 75 L 155 80 L 160 85 L 155 90 L 160 95 L 40 95 L 35 90 L 40 85 Z', length: 310, strokeWidth: 1.5, accent: true },
        // Translucent tape creases
        { d: 'M 65 66 L 62 94 M 130 66 L 128 94', length: 60, strokeWidth: 0.8 },
      ];

    case 'coffee-stain-ring':
      return [
        // Rough coffee mug circle
        { d: 'M 100 35 C 140 35, 170 65, 170 100 C 170 138, 138 170, 100 170 C 62 170, 32 138, 35 100 C 38 65, 68 35, 100 35 Z', length: 430, strokeWidth: 2.5, accent: true },
        // Splash droplet
        { d: 'M 180 85 C 185 80, 192 88, 185 92 Z', length: 25, strokeWidth: 1.5 },
      ];

    case 'hand-underlined-scribble':
    default:
      return [
        // Wavy handwriting double underline
        { d: 'M 30 110 C 60 105, 80 118, 110 112 C 140 106, 160 115, 180 110', length: 155, strokeWidth: 2 },
        { d: 'M 35 125 C 65 120, 85 130, 115 124 C 142 118, 162 126, 175 122', length: 145, strokeWidth: 1.5, accent: true },
      ];
  }
}

