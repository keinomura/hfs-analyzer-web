import { describe, it, expect } from 'vitest';
import { uniformFilter1d } from '../../src/dsp/uniform-filter.js';

describe('uniformFilter1d', () => {
  it('computes moving average with window=3', () => {
    const input = [1, 2, 3, 4, 5];
    const result = uniformFilter1d(input, 3);
    // [1,1,2] -> (1+1+2)/3 = 1.333, [1,2,3]/3=2, [2,3,4]/3=3, [3,4,5]/3=4, [4,5,5]/3=4.667
    expect(result[0]).toBeCloseTo(1.333, 2);
    expect(result[1]).toBeCloseTo(2.0, 5);
    expect(result[2]).toBeCloseTo(3.0, 5);
    expect(result[3]).toBeCloseTo(4.0, 5);
    expect(result[4]).toBeCloseTo(4.667, 2);
  });

  it('returns same values for window=1', () => {
    const input = [10, 20, 30];
    const result = uniformFilter1d(input, 1);
    expect(result[0]).toBeCloseTo(10);
    expect(result[1]).toBeCloseTo(20);
    expect(result[2]).toBeCloseTo(30);
  });

  it('returns Float64Array', () => {
    const result = uniformFilter1d([1, 2, 3], 3);
    expect(result).toBeInstanceOf(Float64Array);
  });
});
