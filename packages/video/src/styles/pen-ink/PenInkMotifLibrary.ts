export interface PenInkPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  accent?: boolean;
  order?: number;
}

export function getPenInkMotif(ref: string): PenInkPathDef[] {
  switch (ref) {
    case 'solitary-figure':
      return [
        // Coat contour and shoulders
        { d: 'M 100 70 C 85 80, 80 120, 75 160 L 125 160 C 120 120, 115 80, 100 70 Z', length: 260, strokeWidth: 2.2, order: 0 },
        // Hat brim & crown
        { d: 'M 82 58 C 82 48, 118 48, 118 58 Z', length: 65, strokeWidth: 2.0, order: 1 },
        { d: 'M 74 60 L 126 60', length: 52, strokeWidth: 2.4, order: 1 },
        // Collar & scarf fold
        { d: 'M 94 66 L 100 76 L 106 66', length: 30, strokeWidth: 1.8, accent: true, order: 2 },
        // Back coat crease lines (hatching)
        { d: 'M 92 90 L 88 135', length: 48, strokeWidth: 1.2, order: 3 },
        { d: 'M 100 85 L 100 145', length: 60, strokeWidth: 1.4, accent: true, order: 3 },
        { d: 'M 108 90 L 112 135', length: 48, strokeWidth: 1.2, order: 3 },
        // Ground shadow hatching
        { d: 'M 65 165 L 135 165', length: 70, strokeWidth: 1.5, accent: true, order: 4 },
        { d: 'M 72 170 L 128 170', length: 56, strokeWidth: 1.0, order: 4 },
      ];

    case 'umbrella-sketch':
      return [
        // Canopy main arc
        { d: 'M 25 125 C 25 45, 175 45, 175 125 Z', length: 340, strokeWidth: 2.6, order: 0 },
        // Central shaft and curved wooden handle
        { d: 'M 100 42 L 100 165 C 100 188, 76 188, 76 174', length: 175, strokeWidth: 2.4, order: 1 },
        // Canopy rib arcs
        { d: 'M 100 45 C 80 75, 60 100, 55 125', length: 95, strokeWidth: 1.4, accent: true, order: 2 },
        { d: 'M 100 45 C 120 75, 140 100, 145 125', length: 95, strokeWidth: 1.4, accent: true, order: 2 },
        // Scalloped bottom rim
        { d: 'M 25 125 Q 40 118 55 125 Q 78 118 100 125 Q 122 118 145 125 Q 160 118 175 125', length: 170, strokeWidth: 1.6, order: 3 },
      ];

    case 'rain-droplets':
      return [
        { d: 'M 35 15 L 20 70', length: 60, strokeWidth: 1.8, order: 0 },
        { d: 'M 85 30 L 70 85', length: 60, strokeWidth: 2.0, accent: true, order: 1 },
        { d: 'M 135 10 L 120 65', length: 60, strokeWidth: 1.8, order: 0 },
        { d: 'M 180 25 L 165 80', length: 60, strokeWidth: 2.0, accent: true, order: 2 },
        { d: 'M 50 85 L 35 140', length: 60, strokeWidth: 2.0, order: 1 },
        { d: 'M 105 95 L 90 150', length: 60, strokeWidth: 2.2, accent: true, order: 0 },
        { d: 'M 155 75 L 140 130', length: 60, strokeWidth: 1.8, order: 2 },
        { d: 'M 75 135 L 60 190', length: 60, strokeWidth: 1.6, order: 3 },
        { d: 'M 130 145 L 115 200', length: 60, strokeWidth: 2.0, accent: true, order: 3 },
      ];

    case 'lantern-glow':
      return [
        // Cap & finial
        { d: 'M 100 15 L 100 30 M 80 30 L 120 30 L 132 55 L 68 55 Z', length: 170, strokeWidth: 2.2, order: 0 },
        // Glass chamber frame
        { d: 'M 68 55 L 78 135 L 122 135 L 132 55 Z', length: 230, strokeWidth: 2.4, order: 1 },
        // Vertical window bars
        { d: 'M 88 55 L 93 135', length: 82, strokeWidth: 1.4, accent: true, order: 2 },
        { d: 'M 112 55 L 107 135', length: 82, strokeWidth: 1.4, accent: true, order: 2 },
        // Base tray & foot
        { d: 'M 72 135 L 128 135 L 116 158 L 84 158 Z', length: 120, strokeWidth: 2.0, order: 1 },
        // Internal warm flame wick
        { d: 'M 100 115 C 92 100, 108 90, 100 78 C 96 90, 104 102, 100 115', length: 65, strokeWidth: 2.0, accent: true, order: 3 },
        // Radiating light sketch rays
        { d: 'M 50 95 L 30 95', length: 20, strokeWidth: 1.2, accent: true, order: 4 },
        { d: 'M 150 95 L 170 95', length: 20, strokeWidth: 1.2, accent: true, order: 4 },
        { d: 'M 58 72 L 40 60', length: 25, strokeWidth: 1.2, order: 4 },
        { d: 'M 142 72 L 160 60', length: 25, strokeWidth: 1.2, order: 4 },
        { d: 'M 58 118 L 40 130', length: 25, strokeWidth: 1.2, order: 4 },
        { d: 'M 142 118 L 160 130', length: 25, strokeWidth: 1.2, order: 4 },
      ];

    case 'quill-and-inkwell':
      return [
        // Quill feather spine
        { d: 'M 160 25 C 130 65, 80 120, 68 155', length: 170, strokeWidth: 2.4, order: 0 },
        // Feather barb vanes
        { d: 'M 160 25 C 180 50, 160 80, 125 105', length: 110, strokeWidth: 1.5, accent: true, order: 1 },
        { d: 'M 145 35 C 130 55, 115 80, 95 110', length: 75, strokeWidth: 1.2, order: 2 },
        // Nib point
        { d: 'M 68 155 L 62 165 L 66 162', length: 20, strokeWidth: 2.0, accent: true, order: 1 },
        // Inkwell bottle
        { d: 'M 40 150 L 55 150 L 55 160 L 65 168 L 65 190 L 30 190 L 30 168 L 40 160 Z', length: 160, strokeWidth: 2.0, order: 3 },
        // Ink ripple oval
        { d: 'M 20 190 Q 50 184 80 190 Q 50 196 20 190', length: 125, strokeWidth: 1.4, accent: true, order: 4 },
      ];

    case 'shoreline-horizon':
      return [
        // Distant horizon line
        { d: 'M 10 90 L 190 90', length: 180, strokeWidth: 2.0, order: 0 },
        // Water ripples / reflection strokes
        { d: 'M 45 102 L 155 102', length: 110, strokeWidth: 1.4, accent: true, order: 1 },
        { d: 'M 70 114 L 130 114', length: 60, strokeWidth: 1.2, order: 2 },
        { d: 'M 85 124 L 115 124', length: 30, strokeWidth: 1.0, accent: true, order: 2 },
        // Curved shoreline curve
        { d: 'M 10 165 C 60 145, 130 150, 190 135', length: 190, strokeWidth: 2.4, order: 0 },
        // Shore sand wash hatching
        { d: 'M 30 175 C 75 160, 120 165, 170 152', length: 145, strokeWidth: 1.4, accent: true, order: 3 },
        { d: 'M 50 185 C 90 175, 130 178, 160 170', length: 115, strokeWidth: 1.0, order: 4 },
      ];

    case 'rose-and-thorns':
      return [
        // Rose bud spiral petals
        { d: 'M 100 55 C 85 40, 115 35, 105 50 C 95 65, 120 70, 100 85 C 80 70, 105 60, 95 50', length: 180, strokeWidth: 2.2, order: 0 },
        { d: 'M 82 65 C 75 80, 90 95, 100 95 C 110 95, 125 80, 118 65', length: 90, strokeWidth: 2.0, accent: true, order: 1 },
        // Calyx sepals
        { d: 'M 90 95 L 85 110 M 110 95 L 115 110 M 100 95 L 100 112', length: 45, strokeWidth: 1.6, order: 2 },
        // Thorny stem
        { d: 'M 100 112 C 105 135, 95 160, 100 185', length: 75, strokeWidth: 2.4, order: 1 },
        // Thorns
        { d: 'M 103 130 L 114 135 L 103 140', length: 25, strokeWidth: 1.8, accent: true, order: 3 },
        { d: 'M 97 155 L 86 160 L 97 165', length: 25, strokeWidth: 1.8, accent: true, order: 3 },
        // Leaf
        { d: 'M 104 145 C 125 140, 140 155, 135 165 C 120 165, 105 155, 104 145 Z', length: 85, strokeWidth: 1.6, order: 4 },
      ];

    case 'clock-face-antique':
      return [
        // Outer case circle
        { d: 'M 100 25 A 70 70 0 1 1 99.9 25', length: 440, strokeWidth: 2.4, order: 0 },
        // Inner rim
        { d: 'M 100 35 A 60 60 0 1 1 99.9 35', length: 377, strokeWidth: 1.2, accent: true, order: 1 },
        // Top crown & loop
        { d: 'M 92 25 L 92 12 L 108 12 L 108 25 M 100 12 A 8 8 0 1 1 99.9 12', length: 80, strokeWidth: 2.0, order: 2 },
        // Center arbor
        { d: 'M 100 92 A 3 3 0 1 1 99.9 92', length: 20, strokeWidth: 2.5, accent: true, order: 3 },
        // Hour and minute hands
        { d: 'M 100 95 L 82 72 M 100 95 L 126 95', length: 60, strokeWidth: 2.2, order: 3 },
        // Roman numeral marks (12, 3, 6, 9)
        { d: 'M 100 40 L 100 48 M 155 95 L 147 95 M 100 150 L 100 142 M 45 95 L 53 95', length: 32, strokeWidth: 1.8, accent: true, order: 4 },
      ];

    case 'bird-in-flight':
      return [
        // Left wing sweep
        { d: 'M 100 110 C 80 80, 50 65, 20 60 C 45 80, 75 95, 95 115', length: 160, strokeWidth: 2.2, order: 0 },
        // Right wing sweep
        { d: 'M 100 110 C 120 80, 150 65, 180 60 C 155 80, 125 95, 105 115', length: 160, strokeWidth: 2.2, order: 0 },
        // Sleek body & tail feathers
        { d: 'M 100 100 L 100 135 L 94 148 M 100 135 L 106 148', length: 65, strokeWidth: 2.0, accent: true, order: 1 },
      ];

    case 'sound-ripples':
    default:
      return [
        { d: 'M 100 65 A 35 35 0 0 1 100 135', length: 110, strokeWidth: 2.2, order: 0 },
        { d: 'M 100 45 A 55 55 0 0 1 100 155', length: 172, strokeWidth: 2.0, accent: true, order: 1 },
        { d: 'M 100 25 A 75 75 0 0 1 100 175', length: 235, strokeWidth: 1.8, order: 2 },
        { d: 'M 100 5 A 95 95 0 0 1 100 195', length: 298, strokeWidth: 1.4, accent: true, order: 3 },
      ];
  }
}
