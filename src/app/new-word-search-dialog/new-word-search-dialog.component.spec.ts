import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSearchModule } from '../word-search.module';
import { NewWordSearchDialogComponent } from './new-word-search-dialog.component';

describe('NewWordSearchDialogComponent', () => {
  let component: NewWordSearchDialogComponent;
  let fixture: ComponentFixture<NewWordSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        WordSearchModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWordSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: fix setup of this spec
  //         NullInjectorError: No provider for MatDialogRef!

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
