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
    @Inject(MAT_DIALOG_DATA) public priorData: any,
    private formBuilder: FormBuilder,
    private hyponymQuery: HyponymsQueryService,
  ) {
    this._isAwaitingSearch = false;
  }

  ngOnInit() {
    const SizeValidators = [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
      Validators.pattern(/^\d+$/),
    ];
    const WordPattern = `[A-Za-z]*`;
    this.formGroup = this.formBuilder.group({
      width: new FormControl(this.priorData.width, SizeValidators),
      height: new FormControl(this.priorData.height, SizeValidators),
      category: new FormControl('', [
        Validators.pattern(new RegExp(`^${WordPattern}$`)),
      ]),
      wordsText: new FormControl(this.priorData.words.join('\n'), [
        Validators.required,
        Validators.pattern(new RegExp(`^(${WordPattern}\n)*${WordPattern}$`)),
      ]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public get widthField() { return this.formGroup.get('width'); }
  public get heightField() { return this.formGroup.get('height'); }
  public get wordsField() { return this.formGroup.get('wordsText'); }
  public get categoryField() { return this.formGroup.get('category'); }

  public get width(): number { return this.widthField.value; }
  public get height(): number { return this.heightField.value; }
  public get category(): string { return this.categoryField.value; }
  public get words(): string[] {
    const wordsText: string = this.wordsField.value;
    return wordsText && wordsText.split(/\s*?\n\s*?/).filter(w => w);
  }

  public searchCategory() {
    this._isAwaitingSearch = true;
    console.log(this.categoryField.value);
    this.hyponymQuery.query(this.categoryField.value).subscribe((hyponyms: string[]) => {
      console.log(hyponyms);
      if (hyponyms && hyponyms.length > 0) {
        this.wordsField.setValue(hyponyms.map(lettersOnly).join('\n'));
      } else {
        // TODO: snackbar to say it didn't return any restults, try something else
      }
      this._isAwaitingSearch = false;
    });
  }

  public get isAwaitingSearch() {
    return this._isAwaitingSearch;
  }

  public get parameters() {
    return {
      width: this.widthField.value,
      height: this.heightField.value,
      words: this.words,
    };
  }
}
