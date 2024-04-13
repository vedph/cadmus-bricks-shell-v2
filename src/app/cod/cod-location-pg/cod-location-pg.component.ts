import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  CodLocationComponent,
  CodLocationRange,
  CodLocationRangePipe,
} from '../../../../projects/myrmidon/cadmus-cod-location/src/public-api';

@Component({
  standalone: true,
  selector: 'app-cod-location-pg',
  templateUrl: './cod-location-pg.component.html',
  styleUrls: ['./cod-location-pg.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    CodLocationComponent,
    CodLocationRangePipe
  ],
})
export class CodLocationPgComponent implements OnInit {
  public ranges: CodLocationRange[] | null;

  public single: FormControl<boolean>;
  public required: FormControl<boolean>;
  public form: FormGroup;

  public initialRanges: CodLocationRange[];

  constructor(formBuilder: FormBuilder) {
    this.ranges = null;
    this.initialRanges = [
      {
        start: {
          s: 'x',
          n: 12,
          v: true,
          c: 'a',
          l: 3,
        },
        end: {
          s: 'x',
          n: 16,
          v: false,
          c: 'b',
          l: 11,
        },
      },
    ];
    // form
    this.single = formBuilder.control(false, { nonNullable: true });
    this.required = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      single: this.single,
      required: this.required,
    });
  }

  ngOnInit(): void {}

  public onRangesChange(ranges: CodLocationRange[] | null) {
    this.ranges = ranges;
  }
}
