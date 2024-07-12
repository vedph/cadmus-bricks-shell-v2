import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExcelColumnPipe } from '../../pipes/excel-column.pipe';
import { Subscription } from 'rxjs';

/**
 * Coordinates of a cell in the physical grid.
 */
export interface PhysicalGridCoords {
  row: number;
  column: number;
}

/**
 * A physical grid location, with the number of rows and columns of the grid,
 * and the coordinates of its selected cells.
 */
export interface PhysicalGridLocation {
  rows: number;
  columns: number;
  coords: PhysicalGridCoords[];
}

/**
 * A viewmodel for the cell in the physical grid.
 */
interface PhysicalGridCell {
  row: number;
  column: number;
  selected?: boolean;
}

@Component({
  selector: 'cadmus-physical-grid-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    // local
    ExcelColumnPipe,
  ],
  templateUrl: './physical-grid-location.component.html',
  styleUrl: './physical-grid-location.component.css',
})
export class PhysicalGridLocationComponent implements OnInit, OnDestroy {
  private _location?: PhysicalGridLocation;
  private _required: boolean = false;
  private _sub?: Subscription;

  @Input()
  public get location(): PhysicalGridLocation | undefined {
    return this._location;
  }
  public set location(value: PhysicalGridLocation | undefined | null) {
    if (value === this._location) {
      return;
    }
    this._location = value || undefined;
    this.rowCount.setValue(this._location?.rows || 1);
    this.columnCount.setValue(this._location?.columns || 1);
    this.setRows();
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    if (this._required === value) {
      return;
    }
    this._required = value;
    if (this.text) {
      this.setTextValidators();
    }
  }

  /**
   * Presets sizes for the grid. Each preset is a string like 'name: 3x4'
   * where name is the preset's name, 3 is the columns count, and 4 the rows
   * count.
   */
  @Input()
  public presets?: string[];

  /**
   * True to allow resizing the grid.
   */
  @Input()
  public allowResize?: boolean;

  /**
   * True to allow custom sizes also when presets is specified.
   */
  @Input()
  public allowCustomSize?: boolean;

  /**
   * True to hide the interactive grid.
   */
  @Input()
  public noGrid?: boolean;

  /**
   * True to collapse the interactive grid.
   */
  @Input()
  public collapsedGrid?: boolean;

  /**
   * The mode of selection in the grid: single allows to select a single cell,
   * multiple allows to select multiple cells wherever they are, contiguous allows
   * to select only contiguous cells.
   */
  @Input()
  public mode: 'single' | 'multiple' | 'contiguous' = 'contiguous';

  @Output()
  public readonly locationChange: EventEmitter<PhysicalGridLocation> =
    new EventEmitter<PhysicalGridLocation>();

  @Output()
  public readonly collapsedGridChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public preset: FormControl<string | null>;
  // text including coordinates of selected cells in Excel-like format,
  // separated by spaces
  public text: FormControl<string>;
  public rowCount: FormControl<number>;
  public columnCount: FormControl<number>;
  public form: FormGroup;

  // the interactive grid viewmodel
  public rows: PhysicalGridCell[][] = [];

  constructor(formBuilder: FormBuilder) {
    this.preset = formBuilder.control(null);
    this.text = formBuilder.control('', { nonNullable: true });
    this.rowCount = formBuilder.control(1, {
      nonNullable: true,
      validators: [Validators.min(1)],
    });
    this.columnCount = formBuilder.control(1, {
      nonNullable: true,
      validators: [Validators.min(1)],
    });
    this.form = formBuilder.group({
      text: this.text,
    });
    this.setTextValidators();
  }

  public ngOnInit(): void {
    this._sub = this.preset.valueChanges.subscribe((value) => {
      if (value && this.presets?.length) {
        const m = value.match(/^(\d+)x(\d+)$/);
        if (m) {
          this.rowCount.setValue(parseInt(m[2], 10));
          this.columnCount.setValue(parseInt(m[1], 10));
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private setTextValidators() {
    if (!this.text) {
      return;
    }
    this.text.clearValidators();
    this.text.addValidators(Validators.pattern(/^(?:\s*[A-Za-z]+[0-9]+\s*)*$/));
    if (this._required) {
      this.text.addValidators([Validators.required]);
    }
  }

  private setRows(): void {
    this.rows = [];
    for (let i = 0; i < this.rowCount.value; i++) {
      const row: PhysicalGridCell[] = [];
      for (let j = 0; j < this.columnCount.value; j++) {
        row.push({ row: i + 1, column: j + 1 });
      }
      this.rows.push(row);
    }
  }

  public setGridSize(): void {
    this.setRows();
    this.location = {
      rows: this.rowCount.value,
      columns: this.columnCount.value,
      coords: [],
    };
    this.locationChange.emit(this._location);
  }

  /**
   * Check whether the specified cells are contiguous, i.e. cell B is adjacent
   * to cell A, in any direction.
   * @param a The first coordinates.
   * @param b The second coordinates.
   * @returns True if the two coordinates are contiguous.
   */
  public areContiguous(a: PhysicalGridCoords, b: PhysicalGridCoords): boolean {
    return (
      b.row >= a.row - 1 &&
      b.row <= a.row + 1 &&
      b.column >= a.column - 1 &&
      b.column <= a.column + 1
    );
  }

  private buildText(): string {
    return (
      this.location?.coords
        .map((c) => String.fromCharCode(65 + c.column) + (c.row + 1))
        .join(' ') || ''
    );
  }

  public resetCells() {
    if (!this._location) {
      return;
    }
    this.rows.forEach((row) => row.forEach((c) => (c.selected = false)));
    this.text.setValue('');
    this.text.markAsDirty();
    this.text.updateValueAndValidity();
    this._location = {
      ...this._location,
      coords: [],
    };
    this.locationChange.emit(this._location);
  }

  public selectCell(cell: PhysicalGridCell) {
    switch (this.mode) {
      case 'single':
        // deselect all cells
        this.rows.forEach((row) => row.forEach((c) => (c.selected = false)));
        break;
      case 'contiguous':
        // deselect all cells which are not contiguous to the clicked one
        const selected = this.rows
          .map((row) => row.filter((c) => c.selected))
          .reduce((acc, val) => acc.concat(val), []);
        if (selected.length) {
          const contiguous = selected.some((c) => this.areContiguous(c, cell));
          if (!contiguous) {
            this.rows.forEach((row) =>
              row.forEach((c) => (c.selected = c === cell))
            );
          }
        } else {
          cell.selected = !cell.selected;
        }
        break;
    }

    // select the clicked cell
    cell.selected = true;

    // update the selected cells text
    this.text.setValue(this.buildText());
    this.text.markAsDirty();
    this.text.updateValueAndValidity();

    // update the location
    this._location = {
      rows: this.rows.length || 1,
      columns: this.rows[0].length || 1,
      coords: this.rows
        .map((row, i) =>
          row
            .map((c, j) => (c.selected ? { row: i, column: j } : null))
            .filter((c): c is PhysicalGridCoords => c !== null)
        )
        .reduce((acc, val) => acc.concat(val), []),
    };
    this.locationChange.emit(this._location);
  }

  public setCellsFromText() {
    if (!this.text) {
      return;
    }

    const text = this.text.value;
    if (!text) {
      this.location = undefined;
    } else {
      const coords = text
        .split(/\s+/)
        .map((s) => s.trim().toUpperCase())
        .map((s) => {
          const m = s.match(/^([A-Za-z]+)([0-9]+)$/);
          if (!m) {
            return null;
          }
          // calculate col from m[1] being an Excel coordinate like AB,
          // and row from m[2] being a 1-based number
          const col = m[1].split('').reduce((acc, val) => {
            return acc * 26 + val.charCodeAt(0) - 64;
          }, 0);
          const row = parseInt(m[2], 10);

          return { row, column: col };
        })
        .filter((c): c is PhysicalGridCoords => c !== null);

      if (coords.length) {
        const filteredCoords = coords.filter(
          (c) =>
            c.row >= 1 &&
            c.row <= this.rowCount.value &&
            c.column >= 1 &&
            c.column <= this.columnCount.value
        );
        this.location = {
          rows: this.rowCount.value,
          columns: this.columnCount.value,
          coords: filteredCoords,
        };
      }
    }
    this.locationChange.emit(this._location);
  }

  public onExpandedChange(expanded: boolean) {
    this.collapsedGridChange.emit(!expanded);
  }
}
