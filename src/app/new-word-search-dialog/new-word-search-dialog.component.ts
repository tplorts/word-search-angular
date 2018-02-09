import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';

import { HyponymsQueryService } from '@app/shared/hyponyms-query.service';


const lettersOnly = (s: string) => s.replace(/[^A-Z]/gi, '');

@Component({
  selector: 'app-new-word-search-dialog',
  templateUrl: './new-word-search-dialog.component.html',
  styleUrls: ['./new-word-search-dialog.component.scss']
})
export class NewWordSearchDialogComponent implements OnInit {

  public formGroup: FormGroup;
  private _isAwaitingSearch: boolean;

  constructor(
    public dialogRef: MatDialogRef<NewWordSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private hyponyms: HyponymsQueryService,
  ) {
    this._isAwaitingSearch = false;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      width: new FormControl(this.data.width, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern(/^\d+$/),
      ]),
      height: new FormControl(this.data.height, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern(/^\d+$/),
      ]),
      category: new FormControl('', [
        Validators.pattern(/^[A-Za-z]*$/),
      ]),
      wordsText: new FormControl(this.data.words.join('\n'), [
        Validators.required,
        Validators.pattern(/^([A-Za-z]+\n)*[A-Za-z]+$/),
      ]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public get width() {
    return this.formGroup.get('width');
  }

  public get height() {
    return this.formGroup.get('height');
  }

  public get wordsText() {
    return this.formGroup.get('wordsText');
  }

  public get category() {
    return this.formGroup.get('category');
  }

  public searchCategory() {
    this._isAwaitingSearch = true;
    console.log(this.category.value);
    this.hyponyms.query(this.category.value).subscribe((hyponyms: string[]) => {
      console.log(hyponyms);
      this.wordsText.setValue(hyponyms.map(lettersOnly).join('\n'));
      this._isAwaitingSearch = false;
    })
  }

  public get isAwaitingSearch() {
    return this._isAwaitingSearch;
  }

  public get parameters(): object {
    const w = this.wordsText.value;
    const result = {
      width: this.width.value,
      height: this.height.value,
      words: w && w.trim().split(/\s+/),
    };
    return result;
  }
}
