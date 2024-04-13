import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { HistoricalDateComponent, HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';

/**
 * Chronotopic coordinates: a place with a date.
 */
export interface Chronotope {
  tag?: string;
  place?: string;
  date?: HistoricalDateModel;
}

@Component({
  standalone: true,
  selector: 'cadmus-refs-chronotope',
  templateUrl: './chronotope.component.html',
  styleUrls: ['./chronotope.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    // Cadmus
    HistoricalDateComponent
  ]
})
export class ChronotopeComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _chronotope: Chronotope | undefined;

  @Input()
  public get chronotope(): Chronotope | undefined | null {
    return this._chronotope;
  }
  public set chronotope(value: Chronotope | undefined | null) {
    if (this._chronotope !== value) {
      this._chronotope = value || undefined;
      this.updateForm(this._chronotope);
    }
  }

  // chronotope-tags
  @Input()
  public ctTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public chronotopeChange: EventEmitter<Chronotope>;

  public tag: FormControl<string | null>;
  public place: FormControl<string | null>;
  public hasDate: FormControl<boolean>;
  public form: FormGroup;

  public initialDate?: HistoricalDateModel;
  public date?: HistoricalDateModel;

  constructor(formBuilder: FormBuilder) {
    this.chronotopeChange = new EventEmitter<Chronotope>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.place = formBuilder.control(null, Validators.maxLength(50));
    this.hasDate = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      tag: this.tag,
      place: this.place,
      hasDate: this.hasDate,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(350)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitChronotopeChange();
      }
    });
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date = date;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  private updateForm(value: Chronotope | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.initialDate = undefined;
      this.form.reset();
    } else {
      this.initialDate = value.date;
      this.tag.setValue(value.tag || null);
      this.place.setValue(value.place || null);
      this.hasDate.setValue(value.date ? true : false);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitChronotopeChange();
  }

  private getChronotope(): Chronotope {
    return {
      tag: this.tag.value?.trim(),
      place: this.place.value?.trim(),
      date: this.hasDate.value ? this.date : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this._chronotope = this.getChronotope();
    this.chronotopeChange.emit(this._chronotope);
  }
}
