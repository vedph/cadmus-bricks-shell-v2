import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import {
  Flag,
  FlagsPickerAdapter,
  FlagsPickerComponent,
} from '@myrmidon/cadmus-ui-flags-picker';

function entryToFlag(entry: ThesaurusEntry): Flag {
  return {
    id: entry.id,
    label: entry.value,
  };
}

/**
 * The physical preservation state of an object.
 */
export interface PhysicalState {
  type: string;
  features?: string[];
  date?: string;
  reporter?: string;
  note?: string;
}

@Component({
  selector: 'cadmus-mat-physical-state',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    FlagsPickerComponent,
  ],
  templateUrl: './physical-state.component.html',
  styleUrls: ['./physical-state.component.css'],
})
export class PhysicalStateComponent {
  private _state?: PhysicalState;
  // flags
  private _featEntries?: ThesaurusEntry[];
  private readonly _flagAdapter = new FlagsPickerAdapter();
  public featFlags$: Observable<Flag[]>;

  public type: FormControl<string>;
  public features: FormControl<Flag[]>;
  public hasDate: FormControl<boolean>;
  public date: FormControl<string | null>;
  public reporter: FormControl<string | null>;
  public note: FormControl<string | null>;
  public form: FormGroup;

  @Input()
  public get state(): PhysicalState | null | undefined {
    return this._state;
  }
  public set state(value: PhysicalState | null | undefined) {
    if (this._state === value) {
      return;
    }
    this._state = value || undefined;
    this.updateForm(this._state);
  }

  /**
   * True to hide UI about the recognition of the state (date and
   * reporter name).
   */
  @Input()
  public noRecognition?: boolean;

  // physical-states
  @Input()
  public stateEntries?: ThesaurusEntry[];

  // physical-state-reporters
  @Input()
  public reporterEntries?: ThesaurusEntry[];

  // physical-state-features
  @Input()
  public get featEntries(): ThesaurusEntry[] | undefined {
    return this._featEntries;
  }
  public set featEntries(value: ThesaurusEntry[] | undefined) {
    if (this._featEntries === value) {
      return;
    }
    this._featEntries = value || [];
    this._flagAdapter.setSlotFlags(
      'features',
      this._featEntries.map(entryToFlag)
    );
  }

  @Output()
  public readonly stateCancel: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly stateChange: EventEmitter<PhysicalState> =
    new EventEmitter<PhysicalState>();

  constructor(formBuilder: FormBuilder) {
    // flags
    this.featFlags$ = this._flagAdapter.selectFlags('features');
    // form
    this.type = formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    });
    this.features = formBuilder.control([], { nonNullable: true });
    this.hasDate = formBuilder.control(false, { nonNullable: true });
    this.date = formBuilder.control(new Date().toUTCString(), {});
    this.reporter = formBuilder.control(null, {
      validators: [Validators.required, Validators.maxLength(100)],
    });
    this.note = formBuilder.control(null, Validators.maxLength(5000));
    this.form = formBuilder.group({
      type: this.type,
      features: this.features,
      hasDate: this.hasDate,
      date: this.date,
      reporter: this.reporter,
      note: this.note,
    });
  }

  private updateForm(state?: PhysicalState): void {
    if (!state) {
      this.form.reset();
      return;
    }
    this.type.setValue(state.type);
    this.features.setValue(
      this._flagAdapter.setSlotChecks('features', state.features || [])
    );
    this.hasDate.setValue(!!state.date);
    this.date.setValue(state.date || null);
    this.reporter.setValue(state.reporter || null);
    this.note.setValue(state.note || null);
    this.form.markAsPristine();
  }

  public onFeatFlagsChange(flags: Flag[]): void {
    this._flagAdapter.setSlotFlags('features', flags, true);
    this.features.setValue(flags);
    this.features.markAsDirty();
    this.features.updateValueAndValidity();
  }

  private getState(): PhysicalState {
    return {
      type: this.type.value?.trim(),
      features: this._flagAdapter.getOptionalCheckedFlagIds('features'),
      date: this.hasDate.value && this.date.value ? this.date.value : undefined,
      reporter: this.reporter.value?.trim(),
      note: this.note.value?.trim(),
    };
  }

  public cancel(): void {
    this.stateCancel.emit();
  }

  public save(): void {
    this._state = this.getState();
    this.stateChange.emit(this._state);
  }
}
