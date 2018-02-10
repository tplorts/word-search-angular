import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


@Injectable()
export class HyponymsQueryService {

  constructor(private http: Http) { }

  query(word: string): Observable<string[]> {
    return this.http.get(`/hyponyms/${word}`, { cache: true }).pipe(
      map((res: Response) => res.json()),
    );
  }
}
