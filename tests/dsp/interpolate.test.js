import { describe, it, expect } from 'vitest';
import { interpolateNaN } from '../../src/dsp/interpolate.js';

describe('interpolateNaN', () => {
  it('interpolates a single NaN gap', () => {
    const input = [1, NaN, 3];
    const result = interpolateNaN(input);
    expect(result[0]).toBe(1);
    expect(result[1]).toBeCloseTo(2);
    expect(result[2]).toBe(3);
  });

  it('fills leading NaN with first valid value', () => {
    const input = [NaN, NaN, 5, 6];
    const result = interpolateNaN(input);
    expect(result[0]).toBe(5);
    expect(result[1]).toBe(5);
    expect(result[2]).toBe(5);
    expect(result[3]).toBe(6);
  });

  it('fills trailing NaN with last valid value', () => {
    const input = [3, 4, NaN, NaN];
    const result = interpolateNaN(input);
    expect(result[2]).toBe(4);
    expect(result[3]).toBe(4);
  });

  it('handles all NaN', () => {
    const input = [NaN, NaN, NaN];
    const result = interpolateNaN(input);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0);
    expect(result[2]).toBe(0);
  });

  it('handles no NaN', () => {
    const input = [1, 2, 3, 4];
    const result = interpolateNaN(input);
    expect(Array.from(result)).toEqual([1, 2, 3, 4]);
  });

  it('returns Float64Array', () => {
    const result = interpolateNaN([1, NaN, 3]);
    expect(result).toBeInstanceOf(Float64Array);
  });
});
