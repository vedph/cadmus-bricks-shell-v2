import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import {
  AssertedChronotope,
  AssertedChronotopeSetComponent,
  AssertedChronotopesPipe,
} from '../../../../projects/myrmidon/cadmus-refs-asserted-chronotope/src/public-api';

@Component({
  selector: 'app-asserted-chronotope-set-pg',
  templateUrl: './asserted-chronotope-set-pg.component.html',
  styleUrls: ['./asserted-chronotope-set-pg.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    AssertedChronotopeSetComponent,
    AssertedChronotopesPipe,
  ],
})
export class AssertedChronotopeSetPgComponent implements OnInit {
  public chronotopes: AssertedChronotope[];

  constructor() {
    this.chronotopes = [
      {
        place: {
          value: 'Rome',
        },
      },
    ];
  }

  ngOnInit(): void {}

  public onChronotopesChange(chronotopes: AssertedChronotope[]): void {
    this.chronotopes = chronotopes;
  }
}
