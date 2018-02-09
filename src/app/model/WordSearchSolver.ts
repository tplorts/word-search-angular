import { Logger } from '../core/logger.service';
import { WordSearch, WordConfiguration } from './WordSearch';
import { GridPosition } from './GridPosition';
import { WordDirection } from './WordDirection';



const log = new Logger('WordSearchSolver');



export class WordSearchSolver {
  constructor(
    private wordSearch: WordSearch,
  ) {}

  private _find(targetWord: string, limit?: number): WordConfiguration[] {
    targetWord = targetWord.toUpperCase();
    const W = this.wordSearch.width;
    const H = this.wordSearch.height;
    const matchingConfigs = new Array<WordConfiguration>();
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const startPosition = new GridPosition(x, y);
        if (this.wordSearch.letter(x, y) === targetWord[0]) {
          for (const direction of WordDirection.All) {
            const configuration = new WordConfiguration(startPosition, direction);
            if (this.isMatch(targetWord, configuration)) {
              matchingConfigs.push(configuration);
              if (limit && matchingConfigs.length === limit) {
                return matchingConfigs;
              }
            }
          }
        }
      }
    }
    return matchingConfigs;
  }

  public find(targetWord: string): WordConfiguration {
    const matches = this._find(targetWord, 1);
    return matches.length > 0 ? matches[0] : null;
  }

  public findAll(targetWord: string): WordConfiguration[] {
    return this._find(targetWord);
  }

  public isMatch(targetWord: string, configuration: WordConfiguration): boolean {
    const endPosition = configuration.endingPosition(targetWord.length);
    if (!this.wordSearch.isValidPosition(endPosition)) {
      return false;
    }
    const extractedWord = this.wordSearch.extract(configuration.startingPosition, endPosition);
    return extractedWord === targetWord;
  }
}
