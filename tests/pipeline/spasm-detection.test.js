import { describe, it, expect } from 'vitest';
import { detectSpasmEpisodes } from '../../src/pipeline/spasm-detection.js';

describe('detectSpasmEpisodes', () => {
  it('detects episodes above threshold with minimum duration', () => {
    // Create a signal with two distinct peaks
    const n = 100;
    const signal = new Float64Array(n);
    // Baseline around 0
    for (let i = 0; i < n; i++) signal[i] = 0;
    // Peak 1: frames 20-25 (6 frames, above min duration 4)
    for (let i = 20; i < 26; i++) signal[i] = 0.5;
    // Peak 2: frames 50-52 (3 frames, below min duration 4)
    for (let i = 50; i < 53; i++) signal[i] = 0.5;
    // Peak 3: frames 70-78 (9 frames, above min duration 4)
    for (let i = 70; i < 79; i++) signal[i] = 0.5;

    const result = detectSpasmEpisodes(signal, 0.5, 4, null);

    // Only peaks 1 and 3 should be detected (peak 2 too short)
    expect(result.episodeCount).toBe(2);
    expect(result.durations).toEqual([6, 9]);

    // Check that the mask marks the right frames
    for (let i = 20; i < 26; i++) expect(result.spasmMask[i]).toBe(1);
    for (let i = 50; i < 53; i++) expect(result.spasmMask[i]).toBe(0);
    for (let i = 70; i < 79; i++) expect(result.spasmMask[i]).toBe(1);
  });

  it('excludes masked frames from statistics', () => {
    const signal = new Float64Array([0, 0, 0, 10, 0, 0, 0]);
    const exclude = new Uint8Array([0, 0, 0, 1, 0, 0, 0]);

    const result = detectSpasmEpisodes(signal, 2.0, 1, exclude);
    // Frame 3 is excluded from statistics and detection
    expect(result.meanVal).toBeCloseTo(0);
    expect(result.episodeCount).toBe(0);
  });
});
