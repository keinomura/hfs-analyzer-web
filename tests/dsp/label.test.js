import { describe, it, expect } from 'vitest';
import { label1d } from '../../src/dsp/label.js';

describe('label1d', () => {
  it('labels contiguous true regions', () => {
    const input = [0, 1, 1, 0, 1, 0];
    const { labeledArray, numFeatures } = label1d(input);
    expect(numFeatures).toBe(2);
    expect(Array.from(labeledArray)).toEqual([0, 1, 1, 0, 2, 0]);
  });

  it('handles empty array', () => {
    const { labeledArray, numFeatures } = label1d([]);
    expect(numFeatures).toBe(0);
    expect(labeledArray.length).toBe(0);
  });

  it('handles all false', () => {
    const { labeledArray, numFeatures } = label1d([0, 0, 0]);
    expect(numFeatures).toBe(0);
    expect(Array.from(labeledArray)).toEqual([0, 0, 0]);
  });

  it('handles all true', () => {
    const { labeledArray, numFeatures } = label1d([1, 1, 1]);
    expect(numFeatures).toBe(1);
    expect(Array.from(labeledArray)).toEqual([1, 1, 1]);
  });

  it('handles alternating', () => {
    const { labeledArray, numFeatures } = label1d([1, 0, 1, 0, 1]);
    expect(numFeatures).toBe(3);
    expect(Array.from(labeledArray)).toEqual([1, 0, 2, 0, 3]);
  });

  it('works with Uint8Array', () => {
    const input = new Uint8Array([0, 1, 1, 0, 0, 1, 1, 1, 0]);
    const { labeledArray, numFeatures } = label1d(input);
    expect(numFeatures).toBe(2);
    expect(Array.from(labeledArray)).toEqual([0, 1, 1, 0, 0, 2, 2, 2, 0]);
  });
});
