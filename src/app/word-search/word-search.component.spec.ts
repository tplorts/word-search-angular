import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSearchModule } from './word-search.module';
import { WordSearchComponent } from './word-search.component';

describe('WordSearchComponent', () => {
  let component: WordSearchComponent;
  let fixture: ComponentFixture<WordSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ WordSearchModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
