import { describe, it, expect } from 'vitest';
import { calculateEAR, calculateMAR } from '../../src/pipeline/eye-metrics.js';

describe('calculateEAR', () => {
  it('computes average vertical distance from 6 points', () => {
    // P1=外眼角, P2=上瞼外, P3=上瞼内, P4=内眼角, P5=下瞼内, P6=下瞼外
    const points = [
      [0, 5],   // P1
      [2, 10],  // P2
      [4, 10],  // P3
      [6, 5],   // P4
      [4, 0],   // P5
      [2, 0],   // P6
    ];
    // dist(P2, P6) = dist([2,10], [2,0]) = 10
    // dist(P3, P5) = dist([4,10], [4,0]) = 10
    // EAR = (10 + 10) / 2 = 10
    expect(calculateEAR(points)).toBeCloseTo(10.0);
  });

  it('returns 0 for wrong number of points', () => {
    expect(calculateEAR([[0, 0], [1, 1]])).toBe(0.0);
  });
});

describe('calculateMAR', () => {
  it('computes width/height ratio', () => {
    const mouth = {
      top: [5, 0],
      bottom: [5, 10],
      left: [0, 5],
      right: [20, 5],
    };
    // width = dist([0,5],[20,5]) = 20, height = dist([5,0],[5,10]) = 10
    // MAR = 20 / 10 = 2.0
    expect(calculateMAR(mouth)).toBeCloseTo(2.0);
  });

  it('returns 0 for zero height', () => {
    const mouth = {
      top: [5, 5],
      bottom: [5, 5],
      left: [0, 5],
      right: [10, 5],
    };
    expect(calculateMAR(mouth)).toBe(0.0);
  });
});
