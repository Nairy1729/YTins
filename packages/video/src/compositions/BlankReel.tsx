import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { PALETTE } from '../constants';

export type BlankReelProps = { label: string };

/**
 * Toolchain smoke test. Deliberately exercises the three primitives the
 * Pen & Ink style will depend on:
 *   1. frame-driven interpolation
 *   2. SVG stroke-dashoffset draw-on animation
 *   3. text rendering at 1080x1920
 */
export const BlankReel: React.FC<BlankReelProps> = ({ label }) => {
    const frame = useCurrentFrame();
    const { durationInFrames, width } = useVideoConfig();

    const ease = { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp' as const };

    const lineLength = 520;
    const draw = interpolate(frame, [10, 55], [lineLength, 0], ease);
    const titleY = interpolate(frame, [20, 60], [24, 0], ease);
    const titleOpacity = interpolate(frame, [20, 55], [0, 1], ease);
    const subOpacity = interpolate(frame, [45, 75], [0, 1], ease);
    const fadeOut = interpolate(
        frame,
        [durationInFrames - 20, durationInFrames - 1],
        [1, 0],
        ease,
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: PALETTE.void,
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Inter, Segoe UI, sans-serif',
                opacity: fadeOut,
            }}
        >
            <svg width={width} height={4} style={{ marginBottom: 64 }}>
                <line
                    x1={(width - lineLength) / 2}
                    y1={2}
                    x2={(width + lineLength) / 2}
                    y2={2}
                    stroke={PALETTE.brass}
                    strokeWidth={2}
                    strokeDasharray={lineLength}
                    strokeDashoffset={draw}
                />
            </svg>

            <div
                style={{
                    color: PALETTE.ink,
                    fontSize: 96,
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    marginTop: 28,
                    color: PALETTE.muted,
                    fontSize: 30,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    opacity: subOpacity,
                }}
            >
                Render pipeline OK
            </div>
        </AbsoluteFill>
    );
};