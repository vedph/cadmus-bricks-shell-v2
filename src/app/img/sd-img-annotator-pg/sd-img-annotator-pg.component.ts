import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import {
  Annotation,
  AnnotationEvent,
  AnnotoriousConfig,
  GalleryImage,
  ImgAnnotationList,
  ImgAnnotatorToolbarComponent,
} from '../../../../projects/myrmidon/cadmus-img-annotator/src/public-api';
import { SdImgAnnotatorDirective } from '../../../../projects/myrmidon/cadmus-sdimg-annotator/src/public-api';
import { MyImgAnnotationListComponent } from '../img-annotation-list/my-img-annotation-list.component';
import { EditAnnotationDialogComponent } from '../edit-annotation-dialog/edit-annotation-dialog.component';

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
    ImgAnnotatorToolbarComponent,
    MyImgAnnotationListComponent,
  ],
})
export class SdImgAnnotatorPgComponent {
  // the list core used by the annotations list child component
  private _list?: ImgAnnotationList<any>;

  // the Annotorious annotator instance derived from the annotator directive
  public annotator?: any;

  // the annotation editor component type, used by the annotations list child
  // component to create a new editor instance inside a popup dialog
  public readonly editor = EditAnnotationDialogComponent;

  // the configuration provided to the annotator directive
  public config?: AnnotoriousConfig = {
    disableEditor: true,
  };

  public tool: string;
  public image: GalleryImage;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig
  ) {
    this.tool = 'rect';
    this.image = {
      id: '1',
      uri: 'assets/sample.jpg',
      title: 'sample',
      description: 'Sample image',
    };
  }

  public onToolChange(tool: string): void {
    this.tool = tool;
  }

  public onListInit(list: ImgAnnotationList<any>) {
    this._list = list;
  }

  public onAnnotatorInit(annotator: any) {
    setTimeout(() => {
      this.annotator = annotator;
    });
  }

  public onCreateSelection(annotation: Annotation) {
    this._list?.onCreateSelection(annotation);
  }

  public onSelectAnnotation(annotation: Annotation) {
    this._list?.onSelectAnnotation(annotation);
  }

  public onCancelSelected(annotation: Annotation) {
    this._list?.onCancelSelected(annotation);
  }

  public editAnnotation(index: number): void {
    this._list?.editAnnotation(index);
  }

  public selectAnnotation(index: number): void {
    this._list?.selectAnnotation(index);
  }

  public removeAnnotation(index: number): void {
    this._list?.removeAnnotation(index);
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    this._list?.onCreateAnnotation(event);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this._list?.onUpdateAnnotation(event);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this._list?.onDeleteAnnotation(event);
  }
}
