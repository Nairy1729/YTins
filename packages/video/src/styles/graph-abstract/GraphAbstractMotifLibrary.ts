export interface GraphPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  accent?: boolean;
}

export function getGraphAbstractMotif(ref: string): GraphPathDef[] {
  switch (ref) {
    case 'waveform-scope':
    case 'sound-ripples':
      return [
        // Sine wave primary oscillation
        { d: 'M 20 100 Q 40 40 60 100 T 100 100 T 140 100 T 180 100', length: 220, strokeWidth: 2, accent: true },
        // Secondary harmonics
        { d: 'M 20 100 Q 30 70 40 100 T 60 100 T 80 100 T 100 100 T 120 100 T 140 100 T 160 100 T 180 100', length: 240, strokeWidth: 1 },
        // Scope bounds & ticks
        { d: 'M 20 50 L 20 150 M 180 50 L 180 150', length: 200, strokeWidth: 1 },
        { d: 'M 15 100 L 25 100 M 175 100 L 185 100', length: 20, strokeWidth: 1.5, accent: true },
      ];

    case 'circular-telemetry':
    case 'clock-face-antique':
      return [
        // Outer telemetry ring with gap
        { d: 'M 100 25 A 75 75 0 1 1 99 25', length: 471, strokeWidth: 1.5 },
        // Inner segmented ring
        { d: 'M 100 45 A 55 55 0 1 1 99 45', length: 345, strokeWidth: 2, accent: true },
        // 4 quadrant ticks
        { d: 'M 100 18 L 100 32 M 100 168 L 100 182', length: 28, strokeWidth: 2, accent: true },
        { d: 'M 18 100 L 32 100 M 168 100 L 182 100', length: 28, strokeWidth: 2, accent: true },
        // Center crosshair
        { d: 'M 90 100 L 110 100 M 100 90 L 100 110', length: 40, strokeWidth: 1.5 },
      ];

    case 'constellation-node':
      return [
        // Connecting topology vectors
        { d: 'M 50 70 L 100 40 L 150 75 L 140 145 L 75 155 Z', length: 350, strokeWidth: 1.2 },
        { d: 'M 100 40 L 100 105 M 50 70 L 100 105 M 150 75 L 100 105 M 140 145 L 100 105 M 75 155 L 100 105', length: 260, strokeWidth: 1, accent: true },
        // Outer vertex rings
        { d: 'M 100 34 A 6 6 0 1 0 100 46 A 6 6 0 1 0 100 34', length: 38, strokeWidth: 1.5 },
        { d: 'M 50 64 A 6 6 0 1 0 50 76 A 6 6 0 1 0 50 64', length: 38, strokeWidth: 1.5 },
        { d: 'M 150 69 A 6 6 0 1 0 150 81 A 6 6 0 1 0 150 69', length: 38, strokeWidth: 1.5 },
        { d: 'M 140 139 A 6 6 0 1 0 140 151 A 6 6 0 1 0 140 139', length: 38, strokeWidth: 1.5 },
        { d: 'M 75 149 A 6 6 0 1 0 75 161 A 6 6 0 1 0 75 149', length: 38, strokeWidth: 1.5 },
      ];

    case 'isometric-cube':
      return [
        // Hexagonal silhouette
        { d: 'M 100 35 L 155 67 L 155 133 L 100 165 L 45 133 L 45 67 Z', length: 380, strokeWidth: 1.8 },
        // Three internal Y-axes meeting at center
        { d: 'M 100 100 L 100 35', length: 65, strokeWidth: 1.5, accent: true },
        { d: 'M 100 100 L 155 133', length: 65, strokeWidth: 1.5, accent: true },
        { d: 'M 100 100 L 45 133', length: 65, strokeWidth: 1.5, accent: true },
      ];

    case 'vector-compass':
      return [
        // 4 pointed star compass
        { d: 'M 100 20 L 108 85 L 180 100 L 108 115 L 100 180 L 92 115 L 20 100 L 92 85 Z', length: 420, strokeWidth: 1.5 },
        { d: 'M 100 20 L 100 180 M 20 100 L 180 100', length: 320, strokeWidth: 1, accent: true },
        { d: 'M 100 80 A 20 20 0 1 0 100 120 A 20 20 0 1 0 100 80', length: 125, strokeWidth: 1.2 },
      ];

    default:
      // Fallback: technical diamond telemetry target
      return [
        { d: 'M 100 30 L 170 100 L 100 170 L 30 100 Z', length: 396, strokeWidth: 1.5 },
        { d: 'M 100 60 L 140 100 L 100 140 L 60 100 Z', length: 226, strokeWidth: 1.5, accent: true },
        { d: 'M 20 100 L 180 100 M 100 20 L 100 180', length: 320, strokeWidth: 1 },
      ];
  }
}

