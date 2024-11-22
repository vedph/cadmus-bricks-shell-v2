import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  AssertedCompositeId,
  AssertedCompositeIdComponent,
} from '@myrmidon/cadmus-refs-asserted-ids';
import { IndexLookupDefinitions, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ThesaurusService } from '@myrmidon/cadmus-api';

export interface LinkEditorComponentData {
  id?: AssertedCompositeId;
  pinByTypeMode?: boolean;
  canSwitchMode?: boolean;
  canEditTarget?: boolean;
  defaultPartTypeKey?: string;
  lookupDefinitions?: IndexLookupDefinitions;
  internalDefault?: boolean;
}

@Component({
  selector: 'cadmus-link-editor',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    AssertedCompositeIdComponent,
  ],
  templateUrl: './link-editor.component.html',
  styleUrl: './link-editor.component.css',
})
export class LinkEditorComponent implements OnInit {
  private _id?: AssertedCompositeId;

  public external?: boolean;
  public pinByTypeMode?: boolean;
  public canSwitchMode?: boolean;
  public canEditTarget?: boolean;
  public defaultPartTypeKey?: string;
  public lookupDefinitions?: IndexLookupDefinitions;
  public internalDefault?: boolean;

  // asserted-id-scopes
  @Input()
  public idScopeEntries?: ThesaurusEntry[];

  // asserted-id-tags
  @Input()
  public idTagEntries?: ThesaurusEntry[];

  // assertion-tags
  @Input()
  public assTagEntries?: ThesaurusEntry[];

  // doc-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  // doc-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public get id(): AssertedCompositeId | undefined {
    return this._id;
  }
  public set id(value: AssertedCompositeId | undefined | null) {
    if (this._id === value) {
      return;
    }
    this._id = value || undefined;
  }

  @Output()
  public idChange: EventEmitter<AssertedCompositeId> =
    new EventEmitter<AssertedCompositeId>();

  @Output()
  public closeRequest: EventEmitter<any> = new EventEmitter<any>();

  public inDialog = false;

  constructor(
    private _thesService: ThesaurusService,
    @Optional()
    public dialogRef?: MatDialogRef<LinkEditorComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data?: LinkEditorComponentData
  ) {
    this.inDialog = !!dialogRef;
    this._id = this.data?.id;
  }

  public ngOnInit(): void {
    this._id = this.data?.id;
    this.loadThesauri();
  }

  private loadThesauri(): void {
    this._thesService
      .getThesauriSet([
        'asserted-id-scopes',
        'asserted-id-tags',
        'assertion-tags',
        'doc-reference-types',
        'doc-reference-tags',
      ])
      .subscribe((set) => {
        this.idScopeEntries = set['asserted-id-scopes']?.entries;
        this.idTagEntries = set['asserted-id-tags']?.entries;
        this.assTagEntries = set['assertion-tags']?.entries;
        this.refTypeEntries = set['doc-reference-types']?.entries;
        this.refTagEntries = set['doc-reference-tags']?.entries;
      });
  }

  public close(): void {
    this.closeRequest.emit();
    this.dialogRef?.close();
  }

  public onIdChange(id: AssertedCompositeId): void {
    this._id = id;
    this.idChange.emit(this._id);
  }

  public save(): void {
    this.dialogRef?.close(this._id);
  }
}
