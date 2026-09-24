export interface SketchPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  isShading?: boolean;
}

export function getPencilSketchMotif(ref: string): SketchPathDef[] {
  switch (ref) {
    case 'sketch-silhouette':
    case 'solitary-figure':
      return [
        // Head outline & soft shading
        { d: 'M 100 45 C 88 45, 80 57, 80 72 C 80 87, 88 95, 100 95 C 112 95, 120 87, 120 72 C 120 57, 112 45, 100 45 Z', length: 130, strokeWidth: 2 },
        // Nose & brow contour
        { d: 'M 88 65 L 82 72 L 87 77 L 86 85', length: 30, strokeWidth: 1.5 },
        // Neck & shoulders
        { d: 'M 92 95 L 85 115 L 45 140 L 40 180', length: 110, strokeWidth: 2.2 },
        { d: 'M 108 95 L 115 115 L 155 140 L 160 180', length: 110, strokeWidth: 2.2 },
        // Cross-hatching shading on shoulder
        { d: 'M 60 145 L 75 135 M 65 152 L 80 142 M 70 160 L 85 150', length: 65, strokeWidth: 1, isShading: true },
        { d: 'M 125 135 L 140 145 M 120 142 L 135 152 M 115 150 L 130 160', length: 65, strokeWidth: 1, isShading: true },
      ];

    case 'sketch-tree':
      return [
        // Trunk with bark curves
        { d: 'M 92 185 C 90 140, 96 115, 96 90', length: 95, strokeWidth: 3 },
        { d: 'M 108 185 C 110 140, 104 115, 104 90', length: 95, strokeWidth: 3 },
        // Roots
        { d: 'M 92 180 C 80 185, 65 190, 50 192', length: 45, strokeWidth: 2 },
        { d: 'M 108 180 C 120 185, 135 190, 150 192', length: 45, strokeWidth: 2 },
        // Main boughs
        { d: 'M 96 90 C 85 70, 60 55, 45 45', length: 70, strokeWidth: 2 },
        { d: 'M 104 90 C 115 70, 140 55, 155 45', length: 70, strokeWidth: 2 },
        { d: 'M 100 85 L 100 40', length: 45, strokeWidth: 1.8 },
        // Delicate twig branches
        { d: 'M 75 66 C 65 52, 55 48, 48 38', length: 35, strokeWidth: 1.2 },
        { d: 'M 125 66 C 135 52, 145 48, 152 38', length: 35, strokeWidth: 1.2 },
        // Bark hatching
        { d: 'M 94 130 L 106 128 M 93 145 L 107 142 M 92 160 L 108 158', length: 40, strokeWidth: 1, isShading: true },
      ];

    case 'sketch-crescent-moon':
      return [
        // Outer moon contour
        { d: 'M 100 25 C 145 25, 165 70, 150 120 C 135 165, 90 175, 75 165', length: 220, strokeWidth: 2.2 },
        // Inner crescent cusp
        { d: 'M 100 25 C 125 45, 135 90, 120 135 C 110 155, 90 165, 75 165', length: 190, strokeWidth: 1.8 },
        // Shading lines inside the body
        { d: 'M 108 50 L 126 58 M 115 75 L 140 82 M 112 105 L 138 112 M 102 135 L 122 142', length: 80, strokeWidth: 1, isShading: true },
        // Little companion pencil star
        { d: 'M 55 60 L 65 60 M 60 55 L 60 65', length: 20, strokeWidth: 1.5 },
        { d: 'M 45 90 L 53 90 M 49 86 L 49 94', length: 16, strokeWidth: 1.2 },
      ];

    case 'sketch-guitar':
      return [
        // Guitar body top lobe
        { d: 'M 100 80 C 85 80, 75 92, 75 108 C 75 120, 85 126, 92 130 C 78 136, 70 152, 70 170 C 70 190, 85 200, 100 200 C 115 200, 130 190, 130 170 C 130 152, 122 136, 108 130 C 115 126, 125 120, 125 108 C 125 92, 115 80, 100 80 Z', length: 360, strokeWidth: 2 },
        // Soundhole
        { d: 'M 100 115 A 12 12 0 1 0 100 139 A 12 12 0 1 0 100 115', length: 75, strokeWidth: 1.8 },
        // Fretboard & headstock
        { d: 'M 96 80 L 96 25 L 104 25 L 104 80', length: 120, strokeWidth: 2 },
        { d: 'M 94 25 L 94 10 L 106 10 L 106 25 Z', length: 45, strokeWidth: 2 },
        // Strings
        { d: 'M 98 12 L 98 175 M 102 12 L 102 175', length: 326, strokeWidth: 0.8, isShading: true },
      ];

    case 'sketch-heart':
    case 'rose-and-thorns':
      return [
        // Expressive hand-drawn heart lobes
        { d: 'M 100 165 C 70 135, 45 110, 45 78 C 45 55, 65 40, 88 40 C 98 40, 106 48, 100 60', length: 170, strokeWidth: 2.2 },
        { d: 'M 100 165 C 130 135, 155 110, 155 78 C 155 55, 135 40, 112 40 C 102 40, 94 48, 100 60', length: 170, strokeWidth: 2.2 },
        // Inner shading strokes
        { d: 'M 60 70 L 78 88 M 70 65 L 90 85 M 82 60 L 100 78', length: 65, strokeWidth: 1, isShading: true },
      ];

    default:
      // Fallback: expressive sketch book / open pages
      return [
        { d: 'M 100 60 C 80 50, 45 50, 30 58 L 30 150 C 45 142, 80 142, 100 152', length: 220, strokeWidth: 2 },
        { d: 'M 100 60 C 120 50, 155 50, 170 58 L 170 150 C 155 142, 120 142, 100 152', length: 220, strokeWidth: 2 },
        { d: 'M 100 60 L 100 152', length: 92, strokeWidth: 2.5 },
        { d: 'M 40 85 L 85 80 M 40 105 L 85 100 M 40 125 L 85 120', length: 135, strokeWidth: 0.8, isShading: true },
        { d: 'M 115 80 L 160 85 M 115 100 L 160 105 M 115 120 L 160 125', length: 135, strokeWidth: 0.8, isShading: true },
      ];
  }
}

