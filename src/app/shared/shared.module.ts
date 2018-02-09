import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { HyponymsQueryService } from './hyponyms-query.service';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    CoreModule,
  ],
  declarations: [
    LoaderComponent
  ],
  exports: [
    LoaderComponent
  ],
  providers: [
    HyponymsQueryService,
  ]
})
export class SharedModule { }
