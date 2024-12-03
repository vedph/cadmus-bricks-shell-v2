import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { NgxToolsValidators } from '@myrmidon/ngx-tools';
import { DialogService } from '@myrmidon/ngx-mat-tools';
import { HistoricalDatePipe } from '@myrmidon/cadmus-refs-historical-date';

import {
  AssertedChronotope,
  AssertedChronotopeComponent,
} from '../asserted-chronotope/asserted-chronotope.component';

@Component({
  selector: 'cadmus-asserted-chronotope-set',
  templateUrl: './asserted-chronotope-set.component.html',
  styleUrls: ['./asserted-chronotope-set.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    AssertedChronotopeComponent,
    HistoricalDatePipe,
  ],
})
export class AssertedChronotopeSetComponent implements OnInit {
  private _chronotopes: AssertedChronotope[] | undefined;

  public editedIndex: number;
  public initialChronotope: AssertedChronotope | undefined;
  public editedChronotope: AssertedChronotope | undefined;

  /**
   * The edited chronotopes.
   */
  @Input()
  public get chronotopes(): AssertedChronotope[] | undefined {
    return this._chronotopes;
  }
  public set chronotopes(value: AssertedChronotope[] | undefined) {
    if (this._chronotopes !== value) {
      this._chronotopes = value;
      this.updateForm(value);
    }
  }
  // chronotope-tags
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;
  // chronotope-assertion-tags
  @Input()
  public assTagEntries?: ThesaurusEntry[];
  // chronotope-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;
  // chronotope-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public chronotopesChange: EventEmitter<AssertedChronotope[]>;

  public entries: FormControl<AssertedChronotope[]>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _dialogService: DialogService) {
    this.editedIndex = -1;
    this.chronotopesChange = new EventEmitter<AssertedChronotope[]>();
    // form
    this.entries = formBuilder.control([], {
      validators: NgxToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.form = formBuilder.group({
      entries: this.entries,
    });
  }

  public ngOnInit(): void {
    if (this._chronotopes?.length) {
      this.updateForm(this._chronotopes);
    }
    this.emitChronotopesChange();
  }

  private updateForm(model: AssertedChronotope[] | undefined): void {
    if (!model) {
      this.form!.reset();
      return;
    }
    this.entries.setValue(model || []);
    this.form.markAsPristine();
  }

  public addChronotope(): void {
    this.editChronotope({});
  }

  public editChronotope(
    chronotope: AssertedChronotope | null,
    index = -1
  ): void {
    if (!chronotope) {
      this.editedIndex = -1;
      this.initialChronotope = undefined;
    } else {
      this.editedIndex = index;
      this.initialChronotope = chronotope;
    }
  }

  public onChronotopeChange(chronotope: AssertedChronotope): void {
    this.editedChronotope = chronotope;
  }

  public onChronotopeSave(): void {
    if (!this.editedChronotope) {
      return;
    }

    const chronotopes = [...this.entries.value];

    if (this.editedIndex > -1) {
      chronotopes.splice(this.editedIndex, 1, this.editedChronotope);
    } else {
      chronotopes.push(this.editedChronotope);
    }

    this.entries.setValue(chronotopes);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.editChronotope(null);
    this.emitChronotopesChange();
  }

  public deleteChronotope(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete chronotope?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const entries = [...this.entries.value];
          entries.splice(index, 1);
          this.entries.setValue(entries);
          this.entries.updateValueAndValidity();
          this.entries.markAsDirty();
          this.emitChronotopesChange();
        }
      });
  }

  public moveChronotopeUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.emitChronotopesChange();
  }

  public moveChronotopeDown(index: number): void {
    if (index + 1 >= this.entries.value.length) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.emitChronotopesChange();
  }

  private emitChronotopesChange(): void {
    this._chronotopes = this.entries.value?.length ? this.entries.value : [];
    this.chronotopesChange.emit(this._chronotopes);
  }
}
