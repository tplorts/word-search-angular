import { Range1D, Range2D } from './DimensionalRange';
import { GridPosition } from './GridPosition';



describe('Range1D', () => {

  it('should span from 0 to 9', () => {
    const range = Range1D.AllOf(10);
    expect(range.from).toBe(0);
    expect(range.to).toBe(9);
  });

  it('should span from 0 to 9', () => {
    // One letter in the positive direction, should be able to go anywhere.
    const range = new Range1D(10, 1, 1);
    expect(range.from).toBe(0);
    expect(range.to).toBe(9);
  });

  it('should span from 0 to 3', () => {
    // 0 1 2 3 4 5 6 7 8 9
    // - - - - - - - - - -
    // * * * A B C D E F G
    const range = new Range1D(10, 1, 7);
    expect(range.from).toBe(0);
    expect(range.to).toBe(3);
  });

  it('should span from 6 to 9', () => {
    // 0 1 2 3 4 5 6 7 8 9
    // - - - - - - - - - -
    // G F E D C B A * * *
    const range = new Range1D(10, -1, 7);
    expect(range.from).toBe(6);
    expect(range.to).toBe(9);
  });

  it('should contain 6 through 9', () => {
    const range = new Range1D(10, -1, 7);
    for (const x of [6, 7, 8, 9]) {
      expect(range.contains(x)).toBe(true);
    }
  });

  it('should not contain 0 through 5', () => {
    const range = new Range1D(10, -1, 7);
    for (const x of [0, 1, 2, 3, 4, 5]) {
      expect(range.contains(x)).toBe(false);
    }
  });

});



describe('Range2D', () => {

  it('should contain (0,0) through (1,3)', () => {
    const range = new Range2D(new Range1D(4, 1, 3), new Range1D(4, 0, 3));
    for (const x of [0, 1]) {
      for (const y of [0, 3]) {
        expect(range.contains(new GridPosition(x, y))).toBe(true);
      }
    }
  });

  it('should contain (2,0) through (3,3)', () => {
    const range = new Range2D(new Range1D(4, 1, 3), new Range1D(4, 0, 3));
    for (const x of [2, 3]) {
      for (const y of [0, 3]) {
        expect(range.contains(new GridPosition(x, y))).toBe(false);
      }
    }
  });

});
