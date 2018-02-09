import { GridPosition } from './GridPosition';
import { WordDirection } from './WordDirection';



describe('GridPosition', () => {

  describe('move', () => {
    let start: GridPosition;
    beforeEach(() => {
      start = new GridPosition(2, 2);
    });

    describe('by 1', () => {
      it('should move from (2, 2) to (3, 2)', () => {
        expect(start.moved(WordDirection.East)).toEqual(new GridPosition(3, 2));
      });
      it('should move from (2, 2) to (1, 2)', () => {
        expect(start.moved(WordDirection.West)).toEqual(new GridPosition(1, 2));
      });
      it('should move from (2, 2) to (2, 3)', () => {
        expect(start.moved(WordDirection.North)).toEqual(new GridPosition(2, 3));
      });
      it('should move from (2, 2) to (2, 1)', () => {
        expect(start.moved(WordDirection.South)).toEqual(new GridPosition(2, 1));
      });
      it('should move from (2, 2) to (3, 3)', () => {
        expect(start.moved(WordDirection.NorthEast)).toEqual(new GridPosition(3, 3));
      });
      it('should move from (2, 2) to (1, 3)', () => {
        expect(start.moved(WordDirection.NorthWest)).toEqual(new GridPosition(1, 3));
      });
      it('should move from (2, 2) to (3, 1)', () => {
        expect(start.moved(WordDirection.SouthEast)).toEqual(new GridPosition(3, 1));
      });
      it('should move from (2, 2) to (1, 1)', () => {
        expect(start.moved(WordDirection.SouthWest)).toEqual(new GridPosition(1, 1));
      });
    });

    const N = 2;
    describe(`by ${N}`, () => {
      it('should move from (2, 2) to (2, 4)', () => {
        expect(start.movedBy(WordDirection.North, N)).toEqual(new GridPosition(2, 4));
      });
    });
  });

});
