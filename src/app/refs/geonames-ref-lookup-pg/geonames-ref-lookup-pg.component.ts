import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { RefLookupComponent } from '../../../../projects/myrmidon/cadmus-refs-lookup/src/public-api';
import {
  GeoNamesRefLookupService,
  GeoNamesToponym,
} from '../../../../projects/myrmidon/cadmus-refs-geonames-lookup/src/public-api';

@Component({
  selector: 'app-geonames-ref-lookup-pg',
  standalone: true,
  imports: [CommonModule, MatCardModule, RefLookupComponent],
  templateUrl: './geonames-ref-lookup-pg.component.html',
  styleUrl: './geonames-ref-lookup-pg.component.scss',
})
export class GeonamesRefLookupPgComponent {
  public toponyms?: GeoNamesToponym[];

  constructor(public service: GeoNamesRefLookupService) {}

  public onItemChange(item: any): void {
    this.toponyms = item;
  }
}
