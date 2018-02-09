import { TestBed, inject } from '@angular/core/testing';

import { HyponymsQueryService } from './hyponyms-query.service';

describe('HyponymsQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HyponymsQueryService]
    });
  });

  it('should be created', inject([HyponymsQueryService], (service: HyponymsQueryService) => {
    expect(service).toBeTruthy();
  }));
});
