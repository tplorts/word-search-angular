import { Logger } from '../core/logger.service';
import { GridPosition } from './GridPosition';
import { Range2D } from './DimensionalRange';
import { WordDirection } from './WordDirection';
import { randomInteger } from './helpers';



const log = new Logger('Grid');



export class Grid<ElementType> {
  public static Errors = {
    InvalidDimensions: new Error('Both dimensions of the grid must be positive'),
  };

  protected data: ElementType[];
  protected positions: GridPosition[];

  constructor(
    private _width: number,
    private _height: number,
  ) {
    if (_width < 1 || _height < 1) {
      throw Grid.Errors.InvalidDimensions;
    }
    const N = _width * _height;
    this.data = new Array<ElementType>(N);
    this.positions = new Array<GridPosition>(N);
    for (let i = 0; i < N; i++) {
      this.positions[i] = this.positionForIndex(i);
    }
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  // 5 6 7 8 9
  // 0 1 2 3 4
  private indexForPosition(p: GridPosition): number {
    return p.x + p.y * this._width;
  }

  private positionForIndex(i: number): GridPosition {
    return new GridPosition(i % this.width, Math.floor(i / this.width));
  }

  public get(p: GridPosition): ElementType {
    return this.data[this.indexForPosition(p)];
  }

  public set(p: GridPosition, letter: ElementType): void {
    this.data[this.indexForPosition(p)] = letter;
  }

  public setAll(setValue: (priorValue: ElementType) => ElementType) {
    let i = 0;
    for (const element of this.data) {
      this.data[i++] = setValue(element);
    }
  }

  public get allPositions(): GridPosition[] {
    return this.positions;
  }

  public emptyPositionsIn(range: Range2D): GridPosition[] {
    return this.positions.filter(p => range.contains(p) && !this.get(p));
  }

  public emptyOrMatchingPositionsIn(letter: ElementType, range: Range2D): GridPosition[] {
    return this.positions.filter(p => range.contains(p) && (!this.get(p) || this.get(p) === letter));
  }

  // public randomEmptyPositionIn(range: Range2D): GridPosition {
  //   const empties = this.emptyPositionsIn(range);
  //   return empties[randomInteger(empties.length)];
  // }

  public forEach(
    start: GridPosition,
    end: GridPosition,
    doSomething: (element: ElementType, position: GridPosition) => void
  ): void {
    // log.debug(`for loop ${start} through ${end}`);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    // log.debug(`for loop ${dx}:${dy}`);
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
      const direction = new WordDirection(dx, dy);
      let here = start;
      doSomething(this.get(here), here);
      while (!here.equals(end)) {
        here = here.moved(direction);
        doSomething(this.get(here), here);
      }
    }
  }

  public toString(): string {
    let str = '';
    for (let y = this.height - 1; y >= 0; y--) {
      str += this.rowString(y) + '\n';
    }
    return str;
  }

  public rowString(y: number): string {
    let str = '';
    for (let x = 0; x < this.width; x++) {
      str += this.get(new GridPosition(x, y)) + ' ';
    }
    return str;
  }
}


export class LetterGrid extends Grid<string> {
  private static CodeA = 'A'.charCodeAt(0);

  public static randomLetter(): string {
    return String.fromCharCode(LetterGrid.CodeA + randomInteger(26));
  }

  public fillRemainder(): void {
    this.setAll((prior: string) => prior || LetterGrid.randomLetter());
  }
}
