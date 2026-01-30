import * as fc from 'fast-check';

// Sample property test to verify fast-check setup
describe('Property-Based Test Setup', () => {
  it('should verify fast-check is working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 20 }
    );
  });

  it('should verify string concatenation property', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        return (a + b).length === a.length + b.length;
      }),
      { numRuns: 20 }
    );
  });
});

