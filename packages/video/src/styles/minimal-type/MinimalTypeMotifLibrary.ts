export interface MinimalPathDef {
  d: string;
  length: number;
  strokeWidth?: number;
  accent?: boolean;
}

export function getMinimalTypeMotif(ref: string): MinimalPathDef[] {
  switch (ref) {
    case 'editorial-crosshair':
      return [
        { d: 'M 100 70 A 30 30 0 1 0 100 130 A 30 30 0 1 0 100 70', length: 188, strokeWidth: 1.2 },
        { d: 'M 100 50 L 100 65', length: 15, strokeWidth: 1.5, accent: true },
        { d: 'M 100 135 L 100 150', length: 15, strokeWidth: 1.5, accent: true },
        { d: 'M 50 100 L 65 100', length: 15, strokeWidth: 1.5, accent: true },
        { d: 'M 135 100 L 150 100', length: 15, strokeWidth: 1.5, accent: true },
        { d: 'M 98 100 L 102 100', length: 4, strokeWidth: 2, accent: true },
      ];

    case 'metric-brackets':
      return [
        { d: 'M 40 60 L 40 40 L 60 40', length: 40, strokeWidth: 1.5 },
        { d: 'M 160 60 L 160 40 L 140 40', length: 40, strokeWidth: 1.5 },
        { d: 'M 40 140 L 40 160 L 60 160', length: 40, strokeWidth: 1.5 },
        { d: 'M 160 140 L 160 160 L 140 160', length: 40, strokeWidth: 1.5 },
        { d: 'M 90 100 L 110 100', length: 20, strokeWidth: 1, accent: true },
      ];

    case 'horizon-line':
      return [
        { d: 'M 20 100 L 92 100', length: 72, strokeWidth: 1 },
        { d: 'M 92 100 L 100 92 L 108 100 L 100 108 Z', length: 32, strokeWidth: 1.5, accent: true },
        { d: 'M 108 100 L 180 100', length: 72, strokeWidth: 1 },
      ];

    case 'sound-bar-matrix':
      return [
        { d: 'M 40 100 L 40 85 M 40 100 L 40 115', length: 30, strokeWidth: 2 },
        { d: 'M 60 100 L 60 70 M 60 100 L 60 130', length: 60, strokeWidth: 2, accent: true },
        { d: 'M 80 100 L 80 60 M 80 100 L 80 140', length: 80, strokeWidth: 2 },
        { d: 'M 100 100 L 100 50 M 100 100 L 100 150', length: 100, strokeWidth: 2.5, accent: true },
        { d: 'M 120 100 L 120 65 M 120 100 L 120 135', length: 70, strokeWidth: 2 },
        { d: 'M 140 100 L 140 75 M 140 100 L 140 125', length: 50, strokeWidth: 2, accent: true },
        { d: 'M 160 100 L 160 90 M 160 100 L 160 110', length: 20, strokeWidth: 2 },
      ];

    case 'geometric-circle':
      return [
        { d: 'M 100 35 A 65 65 0 1 0 100 165 A 65 65 0 1 0 100 35', length: 408, strokeWidth: 1 },
        { d: 'M 100 55 A 45 45 0 1 0 100 145 A 45 45 0 1 0 100 55', length: 283, strokeWidth: 1.5, accent: true },
        { d: 'M 100 20 L 100 30', length: 10, strokeWidth: 1.5 },
        { d: 'M 100 170 L 100 180', length: 10, strokeWidth: 1.5 },
      ];

    case 'minimal-chevron':
      return [
        { d: 'M 70 80 L 100 110 L 130 80', length: 85, strokeWidth: 1.5, accent: true },
        { d: 'M 70 95 L 100 125 L 130 95', length: 85, strokeWidth: 1 },
      ];

    default:
      // Fallback clean geometric diamond
      return [
        { d: 'M 100 40 L 160 100 L 100 160 L 40 100 Z', length: 340, strokeWidth: 1.2 },
        { d: 'M 100 70 L 130 100 L 100 130 L 70 100 Z', length: 170, strokeWidth: 1.5, accent: true },
      ];
  }
}

