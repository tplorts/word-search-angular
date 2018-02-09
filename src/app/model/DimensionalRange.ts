import { GridPosition } from './GridPosition';


// Helps determinte the potential starting positions of a word along a single dimension
export class Range1D {
  public from: number;
  public to: number;

  // Creates a range containing all positions along a dimensional span
  public static AllOf(availableSpaces: number) {
    return new Range1D(availableSpaces, 0, 1);
  }

  constructor(
    // How wide or tall the grid is along the dimension in question
    availableSpaces: number,
    direction: number,
    wordLength: number,
  ) {
    this.from = 0;
    this.to = availableSpaces - 1;

    if (direction < 0) {
      this.from += wordLength - 1;
    } else if (direction > 0) {
      this.to -= wordLength - 1;
    }
  }

  // Whether the position x is within this range
  contains(x: number): boolean {
    return this.from <= x && x <= this.to;
  }
}



export class Range2D {

  // Creates a range containing all positions in a 2D grid
  public static AllOf(width: number, height: number): Range2D {
    return new Range2D(Range1D.AllOf(width), Range1D.AllOf(height));
  }

  constructor(public xRange: Range1D, public yRange: Range1D) {}

  // Whether the position p is within this range
  contains(p: GridPosition): boolean {
    return this.xRange.contains(p.x) && this.yRange.contains(p.y);
  }
}
