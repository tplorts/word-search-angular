import { Injectable } from '@angular/core';
import { WordSearch } from '@app/model/WordSearch';



@Injectable()
export class WordSearchService {

  constructor() { }

  generate(width: number, height: number, words: string[]): WordSearch {
    const ws = new WordSearch(width, height);
    ws.generate(words);
    return ws;
  }

}
