
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { RefLookupOptionsComponent } from '../../../../projects/myrmidon/cadmus-refs-lookup/src/public-api';

@Component({
  standalone: true,
  selector: 'app-ref-lookup-dummy-opt',
  templateUrl: './ref-lookup-dummy-opt.component.html',
  styleUrls: ['./ref-lookup-dummy-opt.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
],
})
export class RefLookupDummyOptComponent implements OnInit {
  public letter: FormControl<string>;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<RefLookupOptionsComponent> // @Inject(CADMUS_REF_LOOKUP_OPTIONS_DATA) public options: any
  ) {
    this.letter = formBuilder.control('a', { nonNullable: true });
    this.form = formBuilder.group({
      letter: this.letter,
    });
  }

  ngOnInit(): void {
    this.letter.setValue(this.data?.options?.letter);
  }

  public cancel(): void {
    this._dialogRef.close();
  }

  public save(): void {
    if (this.data?.options) {
      this.data.options.letter = this.letter.value;
      this._dialogRef.close(this.data.options);
    }
  }
}
