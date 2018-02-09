
export function randomInteger(upperBound: number) {
  return Math.floor(upperBound * Math.random());
}


export function integerSequence(endExlusive: number): number[] {
  const array = [];
  for (let i = 0; i < endExlusive; i++) {
    array.push(i);
  }
  return array;
}


export function unitScalar(x: number) {
  return x && (x / Math.abs(x));
}
