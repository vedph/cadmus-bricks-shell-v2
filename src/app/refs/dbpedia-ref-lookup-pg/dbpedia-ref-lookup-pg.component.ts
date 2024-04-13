import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { DbpediaDoc } from '../../../../projects/myrmidon/cadmus-refs-dbpedia-lookup/src/public-api';
import { DbpediaRefLookupService } from '../../../../projects/myrmidon/cadmus-refs-dbpedia-lookup/src/lib/services/dbpedia-ref-lookup.service';
import { RefLookupComponent } from '../../../../projects/myrmidon/cadmus-refs-lookup/src/public-api';

@Component({
  standalone: true,
  selector: 'app-dbpedia-ref-lookup-pg',
  imports: [CommonModule, MatCardModule, RefLookupComponent],
  templateUrl: './dbpedia-ref-lookup-pg.component.html',
  styleUrl: './dbpedia-ref-lookup-pg.component.css',
})
export class DbpediaRefLookupPgComponent {
  public docs?: DbpediaDoc[];

  constructor(public service: DbpediaRefLookupService) {}

  public onItemChange(item: any): void {
    this.docs = item;
  }
}
