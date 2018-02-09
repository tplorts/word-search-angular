// import { TestBed, inject } from '@angular/core/testing';

import { LetterGrid } from './Grid';
import { Range2D, Range1D } from './DimensionalRange';



describe('LetterGrid', () => {

  describe('Trivial example', () => {
    for (const [w, h] of [[0, 0], [0, 1], [1, 0]]) {
      it(`should not be able to create a ${w}x${h} grid`, () => {
        expect(() => new LetterGrid(w, h)).toThrow(LetterGrid.Errors.InvalidDimensions);
      });
    }
  });

  it('should generate a random letter', () => {
    expect(LetterGrid.randomLetter()).toMatch(/[A-Z]/);
  });

  it('should generate a random grid', () => {
    const grid = new LetterGrid(3, 3);
    grid.fillRemainder();
    expect(grid.toString()).toMatch(/(([A-Z] ){3}\s){3}/);
  });

  it('should have 4 positions in a 2x2', () => {
    const grid = new LetterGrid(2, 2);
    expect(grid.allPositions.length).toBe(4);
  });

  it('should yield 4 empty positions in a 2x2', () => {
    const grid = new LetterGrid(2, 2);
    const fullRange = new Range2D(new Range1D(2, 1, 1), new Range1D(2, 1, 1));
    expect(grid.emptyPositionsIn(fullRange).length).toBe(4);
  });

});
