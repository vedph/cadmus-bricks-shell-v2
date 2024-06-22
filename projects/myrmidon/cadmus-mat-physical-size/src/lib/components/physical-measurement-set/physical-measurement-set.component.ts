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

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { NgToolsModule, NgToolsValidators } from '@myrmidon/ng-tools';

import { PhysicalSizePipe } from '../../pipes/physical-size.pipe';
import {
  PhysicalDimension,
  PhysicalDimensionComponent,
} from '../physical-dimension/physical-dimension.component';
import { Subscription } from 'rxjs';

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
  standalone: true,
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
    // local
    PhysicalDimensionComponent,
    PhysicalSizePipe,
    NgToolsModule,
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

  @ViewChild('#cstn', { static: false })
  public customCtl?: ElementRef;

  public name: FormControl<string | null>;
  public hasCustom: FormControl<boolean>;
  public custom: FormControl<string | null>;
  public measures: FormControl<PhysicalMeasurement[]>;
  public form: FormGroup;

  public editedIndex: number = -1;
  public edited?: PhysicalMeasurement;

  constructor(formBuilder: FormBuilder) {
    this.name = formBuilder.control(null);
    this.hasCustom = formBuilder.control(false, { nonNullable: true });
    this.custom = formBuilder.control(null);
    this.measures = formBuilder.control([], {
      nonNullable: true,
      validators: NgToolsValidators.strictMinLengthValidator(1),
    });
    this.form = formBuilder.group({
      name: this.name,
      hasCustom: this.hasCustom,
      custom: this.custom,
      measures: this.measures,
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

  public addMeasurement(): void {
    if ((this.hasCustom.value && !this.custom.value) || !this.name.value) {
      return;
    }

    this.editedIndex = -1;
    this.edited = {
      name: this.hasCustom.value ? this.custom.value! : this.name.value,
      value: 0,
      unit: this.defaultUnit || this.unitEntries?.[0]?.id || 'cm',
    } as PhysicalMeasurement;

    if (this.hasCustom.value) {
      this.custom.setValue(null);
      this.custom.markAsDirty();
      this.custom.updateValueAndValidity();
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
