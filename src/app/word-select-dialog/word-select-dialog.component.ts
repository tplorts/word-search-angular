import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSelectionList,
  // MatSelectionList
} from '@angular/material';


export enum WordSelectionMode {
  Add,
  Replace,
}


@Component({
  selector: 'app-word-select-dialog',
  templateUrl: './word-select-dialog.component.html',
  styleUrls: ['./word-select-dialog.component.scss']
})
export class WordSelectDialogComponent implements OnInit {

  private _seedWord: string;
  private _allWords: string[];
  private _selectedWords: string[];
  // @ViewChild('wordSelectionList') selectionList: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<WordSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public initialData: any,
  ) {
    this._allWords = [];
    this._selectedWords = [];
  }

  ngOnInit() {
    this._seedWord = this.initialData.seedWord;
    this._allWords = this.initialData.words;
  }

  public get seedWord(): string {
    return this._seedWord;
  }

  public get words(): string[] {
    return this._allWords;
  }

  public get selectedWords(): string[] {
    return this._selectedWords;
  }

  public results(list: MatSelectionList) {
    return {
      words: list.selectedOptions.selected.map(option => option.value),
      mode: WordSelectionMode.Add,
    };
  }

  // public onSelectionChange(list: MatSelectionList) {
  //   this._selectedWords = list.selectedOptions.selected.map(option => option.value);
  // }
}
