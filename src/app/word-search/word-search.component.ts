import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { toNumber } from 'lodash';

import { Logger } from '../core/logger.service';
import { WordSearchService } from './word-search.service';
import { WordSearch } from '../model/WordSearch';
import { WordSearchSolver } from '../model/WordSearchSolver';
import { GridPosition } from '../model/GridPosition';
import { Grid } from '../model/Grid';
import { integerSequence } from '../model/helpers';
import { NewWordSearchDialogComponent } from '../new-word-search-dialog/new-word-search-dialog.component';



const log = new Logger('WordSearch.compenent');



@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.scss']
})
export class WordSearchComponent implements OnInit {

  private wordSearch: WordSearch;
  private solver: WordSearchSolver;

  private _inputWords: string[];
  private _insertedWords: string[];
  private _pendingWords: string[];
  private _discoveredWords: string[];

  private selectedPosition: GridPosition;
  private hintPosition: GridPosition;
  private discoveryGrid: Grid<boolean>;

  private _width: number;
  private _height: number;
  private _rows: number[];
  private _columns: number[];

  private _showPendingWords: boolean;
  private _revealedPendingWords: boolean;
  private _hintCount: number;

  @ViewChild('grid') gridRef: ElementRef;
  @ViewChild('gridCanvas') gridCanvasRef: ElementRef;
  @ViewChild('canvasStroke') canvasStrokeRef: ElementRef;
  private canvasStrokeColor: string;
  private gridTileDisplaySize: number;
  private drawContext: CanvasRenderingContext2D;

  constructor(
    private wordSearchService: WordSearchService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.selectedPosition = null;
    this.hintPosition = null;
    this._showPendingWords = true;
    this._hintCount = 0;

    this.setSize(16, 16);
  }

  ngOnInit() {
    this.generate([
      'astrobleme', 'bruxism', 'clepsydra', 'degust',
      'etui', 'flocculent', 'claggy', 'gaberlunzie',
      'onolatry', 'scrippage', 'zopissa',
    ]);

    window.setTimeout(() => this.initCanvas());
  }

  private initCanvas(): void {
    const strokeRef = <Element> this.canvasStrokeRef.nativeElement;
    this.canvasStrokeColor = window.getComputedStyle(strokeRef).color;
    this.drawContext = this.canvas.getContext('2d');
    if (!this.drawContext) {
      log.warn('Could not get the canvas rending context');
      return;
    }
    this.updateCanvasSize();
    // this.drawLine(new GridPosition(2, 3), new GridPosition(10, 11));
  }

  private updateCanvasSize() {
    const gridContainer = <Element> this.gridRef.nativeElement;
    const gridDisplaySize = gridContainer.getBoundingClientRect();
    this.canvas.setAttribute('width', gridDisplaySize.width.toString());
    this.canvas.setAttribute('height', gridDisplaySize.height.toString());
    this.gridTileDisplaySize = gridContainer.querySelector('td').getBoundingClientRect().width;
  }

  private get canvas(): HTMLCanvasElement {
    return <HTMLCanvasElement> this.gridCanvasRef.nativeElement;
  }

  private drawLine(from: GridPosition, to: GridPosition) {
    const CanvasHeight = toNumber(this.canvas.getAttribute('height'));
    const dc = this.drawContext;
    const tileSize = this.gridTileDisplaySize;
    const toPixels = (letterPosition: number) => letterPosition * tileSize + tileSize / 2;
    dc.strokeStyle = this.canvasStrokeColor;
    dc.lineCap = 'round';
    dc.lineWidth = 3;
    dc.beginPath();
    dc.moveTo(toPixels(from.x), CanvasHeight - toPixels(from.y));
    dc.lineTo(toPixels(to.x), CanvasHeight - toPixels(to.y));
    dc.stroke();
  }

  private setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;

    this.discoveryGrid = new Grid<boolean>(this._width, this._height);
    this.discoveryGrid.setAll(() => false);

    this._columns = integerSequence(this._width);
    this._rows = integerSequence(this._height).reverse();
  }

  public generate(newWords?: string[]): void {
    this.discoveryGrid.setAll(() => false);

    this.wordSearch = new WordSearch(this._width, this._height);
    this.solver = new WordSearchSolver(this.wordSearch);

    if (newWords) {
      this._inputWords = [...newWords];
    }
    this._insertedWords = this.wordSearch.generate(this._inputWords);

    this._pendingWords = [...this._insertedWords];
    this._discoveredWords = [];

    this._revealedPendingWords = this.showPendingWords;
    this._hintCount = 0;
  }

  public createNewWordSearch(): void {
    const dialogRef = this.dialog.open(NewWordSearchDialogComponent, {
      data: {
        width: this._width,
        height: this._height,
        words: this._inputWords,
      },
    });

    dialogRef.afterClosed().subscribe(
      result => {
        log.debug('The dialog was closed', result);
        this.setSize(result.width, result.height);
        this.generate(result.words);
      },
    );

  }

  public get rows(): number[] {
    return this._rows;
  }

  public get columns(): number[] {
    return this._columns;
  }

  public get insertedWords(): string[] {
    return this._insertedWords;
  }

  public get pendingWords(): string[] {
    return this._pendingWords;
  }

  public get discoveredWords(): string[] {
    return this._discoveredWords;
  }

  public get showPendingWords(): boolean {
    return !!this._showPendingWords;
  }

  public set showPendingWords(show: boolean) {
    this._revealedPendingWords = true;
    this._showPendingWords = show;
  }

  public get revealedPendingWords(): boolean {
    return this._revealedPendingWords;
  }

  public get hintCount(): number {
    return this._hintCount;
  }

  public letter(row: number, column: number): string {
    return this.wordSearch.letter(column, row);
  }

  public discoverWord(word: string): boolean {
    const i = this.pendingWords.findIndex(s => s.toUpperCase() === word.toUpperCase());
    if (i < 0) {
      return false;
    }
    const [w] = this._pendingWords.splice(i, 1);
    this._discoveredWords.push(w);
    return true;
  }

  public select(row: number, column: number) {
    const start = this.selectedPosition;
    if (start) {
      this.selectedPosition = null;
      const end = new GridPosition(column, row);
      const word = this.wordSearch.extract(start, end);
      log.debug('selected:', word);
      if (word && this.discoverWord(word)) {
        log.debug('found:', word);
        this.markDiscovered(start, end);
        if (this.isComplete()) {
          this.showComplete();
        }
      }
    } else {
      this.selectedPosition = new GridPosition(column, row);
    }
  }

  public isComplete(): boolean {
    return this._pendingWords.length === 0;
  }

  public markDiscovered(start: GridPosition, end: GridPosition): void {
    this.discoveryGrid.forEach(start, end, (_, pos) => { this.discoveryGrid.set(pos, true); });
    this.drawLine(start, end);
  }

  public revealHint(word: string): void {
    if (this.hintPosition) {
      return; // Another hint has yet to disappear.
    }
    const config = this.solver.find(word);
    if (config) {
      this._hintCount++;
      this.setHint(config.startingPosition);
      Observable.timer(1500).subscribe(() => this.setHint(null));
    } else {
      this.simpleSnackBar(`Whoops!  I could not find ${word}.`);
    }
  }

  private setHint(position: GridPosition): void {
    this.hintPosition = position;
  }

  public blockClasses(row: number, column: number): object {
    return {
      selected: this.isSelected(row, column),
      discovered: this.isDiscovered(row, column),
      hinting: this.isHinting(row, column),
    };
  }

  private isSelected(row: number, column: number): boolean {
    return this.selectedPosition && this.selectedPosition.equalsXY(column, row);
  }

  private isDiscovered(row: number, column: number): boolean {
    return this.discoveryGrid.get(new GridPosition(column, row));
  }

  private isHinting(row: number, column: number): boolean {
    const p = this.hintPosition;
    return p && p.equalsXY(column, row);
  }

  private showComplete(): void {
    this.simpleSnackBar('Well done!  You completed the word search');
  }

  private simpleSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5e3,
    });
  }
}
