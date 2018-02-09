import { unitScalar } from './helpers';



export class WordDirection {
  public static North = new WordDirection(0, +1);
  public static South = new WordDirection(0, -1);
  public static East = new WordDirection(+1, 0);
  public static West = new WordDirection(-1, 0);
  public static NorthEast = new WordDirection(+1, +1);
  public static NorthWest = new WordDirection(-1, +1);
  public static SouthEast = new WordDirection(+1, -1);
  public static SouthWest = new WordDirection(-1, -1);

  public static All = [
    WordDirection.North,
    WordDirection.South,
    WordDirection.East,
    WordDirection.West,
    WordDirection.NorthEast,
    WordDirection.SouthEast,
    WordDirection.NorthWest,
    WordDirection.SouthWest,
  ];

  public static OnlyHorizontal = WordDirection.All.filter(d => d.deltaY === 0);
  public static OnlyVertical = WordDirection.All.filter(d => d.deltaX === 0);

  private _deltaX: number;
  private _deltaY: number;

  constructor(_deltaX: number, _deltaY: number) {
    this._deltaX = unitScalar(_deltaX);
    this._deltaY = unitScalar(_deltaY);
  }

  public get deltaX(): number {
    return this._deltaX;
  }

  public get deltaY(): number {
    return this._deltaY;
  }

  public reverse(): WordDirection {
    return new WordDirection(-this.deltaX, -this.deltaY);
  }

  public toString(): string {
    return `[${this.deltaX}, ${this.deltaY}]`;
  }
}
