export const PEN_INK_THEME = {
  colors: {
    void: '#070709',
    canvas: '#0f0e13',
    canvasLight: '#18171d',
    inkLight: '#f3eee2',
    inkMuted: '#9e998f',
    brassAccent: '#cbb279',
    goldWarm: '#dfc086',
    borderGuide: 'rgba(203, 178, 121, 0.25)',
  },
  strokes: {
    hairline: 1.0,
    fine: 1.6,
    medium: 2.4,
    contour: 3.2,
  },
  fonts: {
    display: '"Instrument Serif", Georgia, "Times New Roman", serif',
    sans: 'Inter, system-ui, -apple-system, sans-serif',
  },
} as const;

export const PEN_INK_PALETTE = PEN_INK_THEME.colors;
export const PEN_INK_TYPOGRAPHY = {
  display: PEN_INK_THEME.fonts.display,
  body: PEN_INK_THEME.fonts.sans,
};

