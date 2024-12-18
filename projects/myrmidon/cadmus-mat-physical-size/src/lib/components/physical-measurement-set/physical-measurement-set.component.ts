import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { FlatLookupPipe, NgxToolsValidators } from '@myrmidon/ngx-tools';

import {
  PhysicalDimension,
  PhysicalDimensionComponent,
} from '../physical-dimension/physical-dimension.component';

/**
 * A physical measurement.
 */
export interface PhysicalMeasurement extends PhysicalDimension {
  name: string;
}

/**
 * Editor for a set of physical measurements.
 */
@Component({
  selector: 'cadmus-physical-measurement-set',
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
    MatTooltipModule,
    // myrmidon
    FlatLookupPipe,
    // local
    PhysicalDimensionComponent,
  ],
  templateUrl: './physical-measurement-set.component.html',
  styleUrl: './physical-measurement-set.component.css',
})
export class PhysicalMeasurementSetComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _measurements: PhysicalMeasurement[] | undefined;

  /**
   * The set of measurements.
   */
  @Input()
  public get measurements(): PhysicalMeasurement[] | undefined {
    return this._measurements;
  }
  public set measurements(value: PhysicalMeasurement[] | undefined | null) {
    if (this._measurements === value) {
      return;
    }
    this._measurements = value || undefined;
    this.measures.setValue(this._measurements || []);
  }

  /**
   * True to allow custom measurement names. This is meaningful
   * only when nameEntries is specified; otherwise, all the
   * measurement names are custom.
   */
  @Input()
  public allowCustomName?: boolean;

  @Input()
  public defaultUnit?: string;

  // physical-size-units
  @Input()
  public unitEntries?: ThesaurusEntry[];
  // physical-size-dim-tags
  @Input()
  public dimTagEntries?: ThesaurusEntry[];
  // physical-size-set-names
  @Input()
  public nameEntries?: ThesaurusEntry[];

  @Output()
  public readonly measurementsChange: EventEmitter<PhysicalMeasurement[]> =
    new EventEmitter<PhysicalMeasurement[]>();

  @ViewChild('cstn', { static: false })
  public customCtl?: ElementRef;

  public name: FormControl<string | null>;
  public hasCustom: FormControl<boolean>;
  public custom: FormControl<string | null>;
  public measures: FormControl<PhysicalMeasurement[]>;
  public batch: FormControl<string | null>;
  public form: FormGroup;

  public editedIndex: number = -1;
  public edited?: PhysicalMeasurement;

  constructor(formBuilder: FormBuilder) {
    this.name = formBuilder.control(null);
    this.hasCustom = formBuilder.control(false, { nonNullable: true });
    this.custom = formBuilder.control(null);
    this.measures = formBuilder.control([], {
      nonNullable: true,
      validators: NgxToolsValidators.strictMinLengthValidator(1),
    });
    this.batch = formBuilder.control(null);
    this.form = formBuilder.group({
      name: this.name,
      hasCustom: this.hasCustom,
      custom: this.custom,
      measures: this.measures,
      batch: this.batch,
    });
  }

  public ngOnInit(): void {
    this._sub = this.hasCustom.valueChanges.subscribe((value) => {
      if (value) {
        this.name.disable();
      } else {
        this.name.enable();
      }
      if (value && this.customCtl) {
        setTimeout(() => this.customCtl!.nativeElement.focus(), 0);
      }
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public closeMeasurement(): void {
    this.editedIndex = -1;
    this.edited = undefined;
  }

  public editMeasurement(index: number): void {
    this.editedIndex = index;
    this.edited = this.measures.value[index];
  }

  public addMeasurement(event?: Event): void {
    if (this.hasCustom.value) {
      this.addCustomMeasurement(event);
      return;
    }
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!this.name.value) {
      return;
    }

    this.editedIndex = -1;
    this.edited = {
      name: this.name.value,
      value: 0,
      unit: this.defaultUnit || this.unitEntries?.[0]?.id || 'cm',
    } as PhysicalMeasurement;

    if (!this.nameEntries?.length) {
      this.name.reset();
    }
  }

  public addCustomMeasurement(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!this.custom.value) {
      return;
    }

    this.editedIndex = -1;
    this.edited = {
      name: this.custom.value,
      value: 0,
      unit: this.defaultUnit || this.unitEntries?.[0]?.id || 'cm',
    } as PhysicalMeasurement;

    this.custom.reset();
  }

  public addBatchMeasurements(): void {
    // parse from batch.value with form "name=value unit;name=value unit;..."
    const entries = this.batch.value
      ?.split(';')
      .filter((s) => s.trim().length > 0);
    if (!entries?.length) {
      return;
    }
    let prevUnit: string | undefined = undefined;
    for (let i = 0; i < entries.length; i++) {
      // match: 1=name, 2=value, 3=unit, 4=tag
      const m = entries[i].match(
        /^\s*([^=]+)\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*([^(]+)?(?:\s*\(([^)]+)\))?\s*$/
      );
      if (m) {
        const name = m[1]?.trim();
        const value = parseFloat(m[2]);
        const unit: string | undefined = m[3]?.trim() || prevUnit;
        const tag = m[4]?.trim();
        if (unit) {
          const measure: PhysicalMeasurement = {
            name: name,
            value: value,
            unit: unit,
            tag: tag,
          };
          this.measures.value.push(measure);
          prevUnit = unit;
        }
      }
    }
  }

  public saveMeasurement(): void {
    if (!this.edited) {
      return;
    }

    const measures = [...this.measures.value];

    if (this.editedIndex === -1) {
      measures.push(this.edited);
    } else {
      measures[this.editedIndex] = this.edited;
    }
    this.closeMeasurement();

    this.measures.setValue(measures);
    this.measures.markAsDirty();
    this.measures.updateValueAndValidity();

    this._measurements = this.measures.value;
    this.measurementsChange.emit(this._measurements);
  }

  public onDimensionChange(dimension: PhysicalDimension): void {
    this.edited = { ...this.edited, ...dimension } as PhysicalMeasurement;
  }

  public moveMeasurementUp(index: number): void {
    const measurements = [...this.measures.value];
    if (index < 1) {
      return;
    }
    const item = measurements[index];
    measurements.splice(index, 1);
    measurements.splice(index - 1, 0, item);
    this.measures.setValue(measurements);
    this.measures.markAsDirty();
    this.measures.updateValueAndValidity();
  }

  public moveMeasurementDown(index: number): void {
    const measurements = [...this.measures.value];
    if (index + 1 >= measurements.length) {
      return;
    }
    const item = measurements[index];
    measurements.splice(index, 1);
    measurements.splice(index + 1, 0, item);
    this.measures.setValue(measurements);
    this.measures.markAsDirty();
    this.measures.updateValueAndValidity();
  }

  public deleteMeasurement(index: number) {
    const measurements = [...this.measures.value];
    measurements.splice(index, 1);

    this.measures.setValue(measurements);
    this.measures.markAsDirty();
    this.measures.updateValueAndValidity();

    this._measurements = this.measures.value;
    this.measurementsChange.emit(this._measurements);
  }
}
