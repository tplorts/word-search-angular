import { WordDirection } from './WordDirection';



export class GridPosition {
  constructor(private _x: number, private _y: number) {}

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public equalsXY(x: number, y: number): boolean {
    return this.x === x && this.y === y;
  }

  public equals(that: GridPosition): boolean {
    return this.x === that.x && this.y === that.y;
  }

  public moved(direction: WordDirection): GridPosition {
    return this.movedBy(direction, 1);
  }

  public movedBy(direction: WordDirection, n: number): GridPosition {
    return new GridPosition(this.x + direction.deltaX * n, this.y + direction.deltaY * n);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
