import { randomInteger, integerSequence, unitScalar } from './helpers';



describe('word search helpers', () => {

  describe('randomInteger', () => {
    it('should create a random integer that is always 0', () => {
      expect(randomInteger(1)).toBe(0);
    });

    const N = 10;
    const Max = 5;
    it(`should create ${N} random integers, all less than ${Max}`, () => {
      for (let i = 0; i < N; i++) {
        expect(randomInteger(Max)).toBeLessThan(Max);
      }
    });
  });

  describe('integerSequence', () => {
    it('should create an empty integer sequence', () => {
      expect(integerSequence(0)).toEqual([]);
    });

    it('should create an integer sequence with just 0', () => {
      expect(integerSequence(1)).toEqual([ 0 ]);
    });

    const X = 8;
    it(`should create a sequence of integers from 0 through ${X - 1}`, () => {
      expect(integerSequence(X)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7 ]);
    });
  });

  describe('unitScalar', () => {
    const cases = [ [0, 0], [1, 1], [0.1, 1], [10, 1], [-1, -1], [-0.1, -1], [-10, -1] ];
    for (const [input, output] of cases) {
      it(`should return ${output} for ${input}`, () => {
        expect(unitScalar(input)).toBe(output);
      });
    }
  });

});
