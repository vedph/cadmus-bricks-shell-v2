import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AnnotationEvent } from '../../../../projects/myrmidon/cadmus-img-annotator/src/public-api';
import { SdImgAnnotatorDirective } from '../../../../projects/myrmidon/cadmus-sdimg-annotator/src/public-api';

@Component({
  standalone: true,
  selector: 'app-sd-img-annotator-pg',
  templateUrl: './sd-img-annotator-pg.component.html',
  styleUrls: ['./sd-img-annotator-pg.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule,
    SdImgAnnotatorDirective,
  ],
})
export class SdImgAnnotatorPgComponent {
  public message?: string;
  constructor() {}

  ngOnInit(): void {}

  public onCreateAnnotation(event: AnnotationEvent) {
    this.message = 'CREATED:\n' + JSON.stringify(event.annotation, null, 2);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this.message = 'UPDATED:\n' + JSON.stringify(event.annotation, null, 2);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this.message = 'DELETED:\n' + JSON.stringify(event.annotation, null, 2);
  }
}
