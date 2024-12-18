import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ListAnnotation } from '../../../../projects/myrmidon/cadmus-img-annotator/src/public-api';
import { EditAnnotationComponent } from '../edit-annotation/edit-annotation.component';

/**
 * A dialog wrapping an annotation editor. This just wires the received
 * data with the editor.
 */
@Component({
  selector: 'app-edit-annotation-dialog',
  templateUrl: './edit-annotation-dialog.component.html',
  styleUrls: ['./edit-annotation-dialog.component.css'],
  imports: [EditAnnotationComponent],
})
export class EditAnnotationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAnnotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListAnnotation<any>
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(annotation: ListAnnotation<any>): void {
    this.dialogRef.close(annotation);
  }
}
