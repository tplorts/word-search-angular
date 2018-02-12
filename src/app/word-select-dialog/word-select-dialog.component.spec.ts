import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSelectDialogComponent } from './word-select-dialog.component';

describe('WordSelectDialogComponent', () => {
  let component: WordSelectDialogComponent;
  let fixture: ComponentFixture<WordSelectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordSelectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
