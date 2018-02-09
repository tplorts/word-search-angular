import { WordDirection } from './WordDirection';


describe('WordDirection', () => {

  it('should create an up-right direction (1,1)', () => {
    const direction = new WordDirection(1, 1);
    expect(direction.deltaX).toBe(1);
    expect(direction.deltaY).toBe(1);
  });

  it('should create an up-right direction (1,1)', () => {
    const direction = new WordDirection(14, 13);
    expect(direction.deltaX).toBe(1);
    expect(direction.deltaY).toBe(1);
  });

  it('should create an down-right direction (1,-1)', () => {
    const direction = new WordDirection(10, -10);
    expect(direction.deltaX).toBe(1);
    expect(direction.deltaY).toBe(-1);
  });

  it('should have a total of 8 possible direcitons', () => {
    expect(WordDirection.All.length).toBe(8);
  });

  it('should have 2 horizontal direcitons', () => {
    expect(WordDirection.OnlyHorizontal.length).toBe(2);
  });

  it('should have 2 vertical direcitons', () => {
    expect(WordDirection.OnlyVertical.length).toBe(2);
  });

});
