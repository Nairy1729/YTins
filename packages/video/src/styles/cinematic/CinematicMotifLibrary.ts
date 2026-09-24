export interface CinematicPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  accent?: boolean;
}

export function getCinematicMotif(ref: string): CinematicPathDef[] {
  switch (ref) {
    case 'shutter-iris':
      return [
        // Outer aperture ring
        { d: 'M 100 25 A 75 75 0 1 0 100 175 A 75 75 0 1 0 100 25', length: 471, strokeWidth: 2 },
        // 8 Intersecting aperture blades
        { d: 'M 100 25 L 140 100', length: 85, strokeWidth: 1.5, accent: true },
        { d: 'M 153 47 L 130 135', length: 90, strokeWidth: 1.5 },
        { d: 'M 175 100 L 100 140', length: 85, strokeWidth: 1.5, accent: true },
        { d: 'M 153 153 L 65 130', length: 90, strokeWidth: 1.5 },
        { d: 'M 100 175 L 60 100', length: 85, strokeWidth: 1.5, accent: true },
        { d: 'M 47 153 L 70 65', length: 90, strokeWidth: 1.5 },
        { d: 'M 25 100 L 100 60', length: 85, strokeWidth: 1.5, accent: true },
        { d: 'M 47 47 L 135 70', length: 90, strokeWidth: 1.5 },
        // Center polygon aperture opening
        { d: 'M 100 70 L 125 85 L 125 115 L 100 130 L 75 115 L 75 85 Z', length: 155, strokeWidth: 1.8, accent: true },
      ];

    case 'film-frame':
      return [
        // Outer 35mm frame
        { d: 'M 35 45 L 165 45 L 165 155 L 35 155 Z', length: 480, strokeWidth: 2 },
        // Inner image window
        { d: 'M 50 60 L 150 60 L 150 140 L 50 140 Z', length: 360, strokeWidth: 1.5, accent: true },
        // Left Sprocket Holes
        { d: 'M 40 52 L 45 52 L 45 62 L 40 62 Z', length: 30, strokeWidth: 1 },
        { d: 'M 40 75 L 45 75 L 45 85 L 40 85 Z', length: 30, strokeWidth: 1 },
        { d: 'M 40 98 L 45 98 L 45 108 L 40 108 Z', length: 30, strokeWidth: 1 },
        { d: 'M 40 120 L 45 120 L 45 130 L 40 130 Z', length: 30, strokeWidth: 1 },
        { d: 'M 40 142 L 45 142 L 45 152 L 40 152 Z', length: 30, strokeWidth: 1 },
        // Right Sprocket Holes
        { d: 'M 155 52 L 160 52 L 160 62 L 155 62 Z', length: 30, strokeWidth: 1 },
        { d: 'M 155 75 L 160 75 L 160 85 L 155 85 Z', length: 30, strokeWidth: 1 },
        { d: 'M 155 98 L 160 98 L 160 108 L 155 108 Z', length: 30, strokeWidth: 1 },
        { d: 'M 155 120 L 160 120 L 160 130 L 155 130 Z', length: 30, strokeWidth: 1 },
        { d: 'M 155 142 L 160 142 L 160 152 L 155 152 Z', length: 30, strokeWidth: 1 },
      ];

    case 'lens-flare-burst':
    case 'lantern-glow':
      return [
        // Starburst optical flare rays
        { d: 'M 20 100 L 180 100', length: 160, strokeWidth: 2, accent: true },
        { d: 'M 100 20 L 100 180', length: 160, strokeWidth: 2, accent: true },
        { d: 'M 45 45 L 155 155', length: 155, strokeWidth: 1.2 },
        { d: 'M 155 45 L 45 155', length: 155, strokeWidth: 1.2 },
        // Concentric optical rings
        { d: 'M 100 80 A 20 20 0 1 0 100 120 A 20 20 0 1 0 100 80', length: 125, strokeWidth: 1.5 },
        { d: 'M 100 65 A 35 35 0 1 0 100 135 A 35 35 0 1 0 100 65', length: 220, strokeWidth: 1 },
      ];

    default:
      // Fallback: Anamorphic streak with halo
      return [
        { d: 'M 10 100 L 190 100', length: 180, strokeWidth: 2.5, accent: true },
        { d: 'M 75 75 A 35 35 0 1 0 125 125', length: 110, strokeWidth: 1.5 },
        { d: 'M 85 85 A 20 20 0 1 1 115 115', length: 65, strokeWidth: 1.5, accent: true },
      ];
  }
}

