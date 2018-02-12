import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
} from '@angular/material';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';
import { sortBy, sortedUniqBy } from 'lodash';
import { HyponymsQueryService } from '@app/shared/hyponyms-query.service';
import { WordSelectDialogComponent } from '@app/word-select-dialog/word-select-dialog.component';


const lettersOnly = (s: string) => s.replace(/[^A-Z]/gi, '');
const asUpperCase = (s: string) => s.toUpperCase();


export interface IWordSearchParameters {
  width: number;
  height: number;
  category?: string;
  words: string[];
}


@Component({
  selector: 'app-new-word-search-dialog',
  templateUrl: './new-word-search-dialog.component.html',
  styleUrls: ['./new-word-search-dialog.component.scss']
})
export class NewWordSearchDialogComponent implements OnInit {

  public formGroup: FormGroup;
  private _isAwaitingSearch: boolean;
  @ViewChild('wordsFieldInput') _wordsFieldInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewWordSearchDialogComponent, IWordSearchParameters>,
    @Inject(MAT_DIALOG_DATA) public priorData: any,
    private formBuilder: FormBuilder,
    private hyponymQuery: HyponymsQueryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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
    const SingleWordRegex = new RegExp(`^${WordPattern}$`);
    const MultiWordRegex = new RegExp(`^(${WordPattern}\n)*${WordPattern}$`);

    this.formGroup = this.formBuilder.group({
      width: new FormControl(this.priorData.width, SizeValidators),
      height: new FormControl(this.priorData.height, SizeValidators),
      category: new FormControl('', [
        Validators.pattern(SingleWordRegex),
      ]),
      wordsText: new FormControl(this.priorData.words.join('\n'), [
        Validators.required,
        Validators.pattern(MultiWordRegex),
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
    const word = this.category;
    if (!word) {
      return;
    }
    this._isAwaitingSearch = true;
    this.hyponymQuery.query(word)
    .catch(err => {
      this.simpleSnackBar(`Could not connect to find words.  Please enter words manually for now.`);
      throw err;
    })
    .finally(() => (this._isAwaitingSearch = false))
    .subscribe((hyponyms: string[]) => {
      if (hyponyms && hyponyms.length > 0) {
        // Important that we strip any non-letter characters before
        // eliminating duplicates.
        const sortedHypernyms = sortBy(hyponyms.map(lettersOnly), asUpperCase);
        const uniqueHyponyms = sortedUniqBy(sortedHypernyms, asUpperCase);
        this.openWordSelection(word, uniqueHyponyms);
      } else {
        this.simpleSnackBar(`${word} didn't yield any results; try another`);
      }
    });
  }

  public get isAwaitingSearch() {
    return this._isAwaitingSearch;
  }

  public get parameters(): IWordSearchParameters {
    return {
      width: this.widthField.value,
      height: this.heightField.value,
      category: this.category,
      words: this.words,
    };
  }

  private simpleSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5e3 });
  }

  private openWordSelection(seedWord: string, words: string[]): void {
    this.dialog.open(WordSelectDialogComponent, {
      data: { seedWord, words },
      autoFocus: false,
      maxHeight: '96vh',
    })
    .afterClosed().filter(result => !!result).subscribe(
      result => {
        this.wordsField.setValue(result.words.join('\n'));
        (<HTMLTextAreaElement> this._wordsFieldInput.nativeElement).focus();
      },
    );
  }

}
