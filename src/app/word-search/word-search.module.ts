import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';

import { WordSearchService } from './word-search.service';
import { WordSearchComponent } from './word-search.component';
import { NewWordSearchDialogComponent } from '../new-word-search-dialog/new-word-search-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    WordSearchComponent,
    NewWordSearchDialogComponent,
  ],
  entryComponents: [
    NewWordSearchDialogComponent,
  ],
  exports: [
    WordSearchComponent,
  ],
  providers: [
    WordSearchService,
  ],
})
export class WordSearchModule { }
