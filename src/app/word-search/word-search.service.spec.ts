import { TestBed, inject } from '@angular/core/testing';

import { WordSearchService } from './word-search.service';

describe('WordSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordSearchService]
    });
  });

  it('should be created', inject([WordSearchService], (service: WordSearchService) => {
    expect(service).toBeTruthy();
  }));
});
