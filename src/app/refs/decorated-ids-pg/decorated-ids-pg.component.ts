import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';

import {
  DecoratedId,
  DecoratedIdsComponent,
} from '../../../../projects/myrmidon/cadmus-refs-decorated-ids/src/public-api';

@Component({
  selector: 'app-decorated-ids-pg',
  templateUrl: './decorated-ids-pg.component.html',
  styleUrls: ['./decorated-ids-pg.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    DecoratedIdsComponent,
  ],
})
export class DecoratedIdsPgComponent implements OnInit {
  public ids: DecoratedId[];

  constructor() {
    this.ids = [];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: DecoratedId[]): void {
    this.ids = ids;
  }
}
