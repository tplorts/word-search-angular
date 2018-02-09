// import { TestBed, inject } from '@angular/core/testing';

import { WordSearch, WordConfiguration } from './WordSearch';
import { WordDirection } from './WordDirection';
import { GridPosition } from './GridPosition';



describe('WordSearch', () => {

  describe('Trivial example', () => {
    for (const [w, h] of [[0, 0], [0, 1], [1, 0]]) {
      it(`should not be able to create a ${w}x${h} word search`, () => {
        expect(() => new WordSearch(w, h)).toThrow(WordSearch.Errors.InvalidDimensions);
      });
    }
  });



  describe('method potentialDirections', () => {
    it('should find 8 potential directions for inserting "A"', () => {
      const ws = new WordSearch(2, 2);
      const directions = ws.potentialDirections('a');
      expect(directions).toBe(WordDirection.All);
    });
    it('should find 8 potential directions for inserting "AB"', () => {
      const ws = new WordSearch(2, 2);
      const directions = ws.potentialDirections('ab');
      expect(directions).toBe(WordDirection.All);
    });
    it('should find no potential directions for inserting "AB" into a 1x1', () => {
      const ws = new WordSearch(1, 1);
      const directions = ws.potentialDirections('ab');
      expect(directions.length).toBe(0);
    });
    it('should find only horizontal directions for inserting "AB" into a 2x1', () => {
      const ws = new WordSearch(2, 1);
      const directions = ws.potentialDirections('ab');
      expect(directions).toBe(WordDirection.OnlyHorizontal);
    });
    it('should find only vertical directions for inserting "AB" into a 1x2', () => {
      const ws = new WordSearch(1, 2);
      const directions = ws.potentialDirections('ab');
      expect(directions).toBe(WordDirection.OnlyVertical);
    });
  });


  describe('1x1 example', () => {
    let ws: WordSearch;
    beforeEach(() => { ws = new WordSearch(1, 1); });

    it('should construct without error', () => {
      expect(ws).toBeDefined();
    });

    it('should find 8 potential directions for inserting "A"', () => {
      const directions = ws.potentialDirections('a');
      expect(directions.length).toBe(8);
    });

    it('should compute a starting range to insert "A"', () => {
      const r = ws.startingRange('a', WordDirection.All[0]);
      expect([r.xRange.from, r.xRange.to, r.yRange.from, r.yRange.to]).toEqual([0, 0, 0, 0]);
    });

    it('should find 8 possible configurations for inserting "A"', () => {
      const configs = ws.allPossibleConfigurations('a');
      expect(configs.length).toBe(8);
    });

    it('should auto insert "A"', () => {
      ws.autoInsert('a');
      expect(ws.toString()).toBe('A \n');
    });

    it('should fail to insert a second "A"', () => {
      ws.autoInsert('a');
      expect(() => ws.autoInsert('a')).toThrow(WordSearch.Errors.CannotInsertWord);
    });
  });


  describe('2x2 example', () => {
    let ws: WordSearch;
    beforeEach(() => { ws = new WordSearch(2, 2); });

    it('should construct without error', () => {
      expect(ws).toBeDefined();
    });

    it('should find 8 potential directions for inserting "A"', () => {
      const directions = ws.potentialDirections('a');
      expect(directions.length).toBe(8);
    });

    it('should compute a starting range to insert "A"', () => {
      const r = ws.startingRange('a', WordDirection.All[0]);
      expect([r.xRange.from, r.xRange.to, r.yRange.from, r.yRange.to]).toEqual([0, 1, 0, 1]);
    });

    it('should auto insert "A"', () => {
      ws.autoInsert('a');
      expect(ws.toString()).toMatch(/A/);
    });

    it('should auto insert four "A"s', () => {
      ws.autoInsert('a');
      ws.autoInsert('a');
      ws.autoInsert('a');
      ws.autoInsert('a');
      expect(ws.toString()).toMatch(/A A \sA A /);
    });

    it('should fail to insert a fifth "A"', () => {
      ws.autoInsert('a');
      ws.autoInsert('a');
      ws.autoInsert('a');
      ws.autoInsert('a');
      expect(() => ws.autoInsert('a')).toThrow(WordSearch.Errors.CannotInsertWord);
    });

    it('should find 12 possible insert configs for "AB"', () => {
      const configs = ws.allPossibleConfigurations('ab');
      expect(configs.length).toBe(12);
    });

    it('should find 12 possible insert configs for "AB" after inserting "A"', () => {
      ws.autoInsert('a');
      const configs = ws.allPossibleConfigurations('ab');
      expect(configs.length).toBe(12);
    });

    it('should find 9 possible insert configs for "AB" after inserting "X"', () => {
      ws.autoInsert('x');
      const configs = ws.allPossibleConfigurations('ab');
      expect(configs.length).toBe(9);
    });
  });

  // it('should fill the word search with random letters', () => {
  //   const ws = new WordSearch(4, 4);
  //   ws.finishGenerating();
  //   expect(ws.toString()).toMatch(/^(([A-Z] ){4}\s){4}$/);
  // });

  describe('Small example', () => {
    it('should insert kitty across around the middle', () => {
      const ws = new WordSearch(6, 6);
      ws.steamroll('kitty', new WordConfiguration(new GridPosition(1, 3), new WordDirection(1, 0)));
      expect(ws.toString()).toMatch('K I T T Y');
    });

    it('should insert kitty across around the middle with the rest random', () => {
      const ws = new WordSearch(6, 6);
      ws.steamroll('kitty', new WordConfiguration(new GridPosition(1, 3), new WordDirection(1, 0)));
      ws.finishGenerating();
      expect(ws.toString()).toMatch('K I T T Y');
    });


    it('should insert THE down the middle', () => {
      const ws = new WordSearch(4, 4);
      ws.insert('the', new WordConfiguration(new GridPosition(1, 3), new WordDirection(0, -1)));
      const gridString = ws.toString();
      for (const letter of 'THE') {
        expect(gridString).toContain(letter);
      }
    });


    it('should insert THE somewhere', () => {
      const ws = new WordSearch(4, 4);
      ws.autoInsert('the');
      const gridString = ws.toString();
      for (const letter of 'THE') {
        expect(gridString).toContain(letter);
      }
    });

    it('should make a word search', () => {
      const ws = new WordSearch(4, 5);
      const someWords = ['the', 'cat', 'in', 'a', 'hat'];
      expect(ws.generate(someWords)).toEqual(someWords);
      const gridString = ws.toString();
      for (const letter of someWords.join('').toUpperCase()) {
        expect(gridString).toContain(letter);
      }
    });

    it('should insert 4 5-letter words in a 5x4 all row-wise', () => {
      const ws = new WordSearch(5, 4);
      const someWords = ['mango', 'apple', 'phone', 'light'];
      expect(ws.generate(someWords)).toEqual(someWords);
      const asRow = (s: string) => s.toUpperCase().split('').join(' ');
      const asRowReverse = (s: string) => s.toUpperCase().split('').reverse().join(' ');
      const gridString = ws.toString();
      for (const word of someWords) {
        expect(gridString).toMatch(new RegExp(`(${asRow(word)}|${asRowReverse(word)})`));
      }
    });
  });
});
