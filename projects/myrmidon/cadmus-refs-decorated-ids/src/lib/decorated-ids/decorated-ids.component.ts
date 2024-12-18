import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  DocReference,
  DocReferencesComponent,
} from '@myrmidon/cadmus-refs-doc-references';

/**
 * An ID optionally decorated with rank, tag, and sources.
 */
export interface DecoratedId {
  id: string;
  rank?: number;
  tag?: string;
  sources?: DocReference[];
}

/**
 * Decorated IDs real-time editor.
 * To avoid circular updates, in your container bind ids to initialIds
 * and handle idsChange for ids.setValue.
 */
@Component({
  selector: 'cadmus-refs-decorated-ids',
  templateUrl: './decorated-ids.component.html',
  styleUrls: ['./decorated-ids.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    DocReferencesComponent,
  ],
})
export class DecoratedIdsComponent implements OnInit {
  private _ids: DecoratedId[];

  public editedIndex: number;
  public editedId: DecoratedId | undefined;
  public editorOpen: boolean;

  public subForm: FormGroup;
  public id: FormControl<string | null>;
  public rank: FormControl<number>;
  public tag: FormControl<string | null>;
  public sources: FormControl<DocReference[]>;
  public form: FormGroup;

  @Input()
  public get ids(): DecoratedId[] {
    return this._ids;
  }
  public set ids(value: DecoratedId[]) {
    if (this._ids !== value) {
      this._ids = value || [];
      this.closeIdEditor();
    }
  }

  // decorated-id-tags
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  // doc-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  // doc-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Output()
  public idsChange: EventEmitter<DecoratedId[]>;

  constructor(formBuilder: FormBuilder) {
    this.idsChange = new EventEmitter<DecoratedId[]>();
    this._ids = [];
    this.editedIndex = -1;
    this.editorOpen = false;

    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.rank = formBuilder.control(0, { nonNullable: true });
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.sources = formBuilder.control([], { nonNullable: true });
    this.subForm = formBuilder.group({
      id: this.id,
      rank: this.rank,
      tag: this.tag,
      sources: this.sources,
    });
    this.form = formBuilder.group({
      subForm: this.subForm,
    });
  }

  public ngOnInit(): void {
    this.emitChange();
  }

  private closeIdEditor(): void {
    this.editedIndex = -1;
    this.editedId = undefined;
    this.subForm?.reset();
    this.subForm?.disable();
    this.editorOpen = false;
  }

  private openIdEditor(id: DecoratedId): void {
    this.subForm.enable();

    this.editedId = id;
    this.sources.setValue(id.sources || []);
    this.id.setValue(id.id);
    this.rank.setValue(id.rank || 0);
    this.tag.setValue(id.tag || null);

    this.subForm.markAsPristine();
    this.editorOpen = true;
  }

  public addId(): void {
    this.editedIndex = -1;
    this.openIdEditor({ id: '' });
  }

  public editId(index: number): void {
    this.editedIndex = index;
    this.openIdEditor(this._ids[index]);
  }

  private getEditedId(): DecoratedId | null {
    if (!this.editedId) {
      return null;
    }
    return {
      id: this.id.value?.trim() || '',
      rank: this.rank.value || 0,
      tag: this.tag.value?.trim(),
      sources: this.sources.value?.length ? this.sources.value : undefined,
    };
  }

  public deleteId(index: number): void {
    if (this.editedIndex === index) {
      this.closeEditedId();
    }
    this.closeEditedId();
    this._ids.splice(index, 1);
    this.emitChange();
  }

  public onSourcesChange(sources: DocReference[]): void {
    this.sources.setValue(sources);
    this.subForm.markAsDirty();
    this.emitChange();
  }

  public closeEditedId(): void {
    this.closeIdEditor();
  }

  public saveEditedId(): void {
    if (this.subForm.invalid) {
      return;
    }
    const id = this.getEditedId();
    if (!id) {
      return;
    }
    if (this.editedIndex === -1) {
      this._ids.push(id);
    } else {
      this._ids.splice(this.editedIndex, 1, id);
    }
    this.closeEditedId();
    this.emitChange();
  }

  private emitChange(): void {
    this.idsChange.emit(this._ids);
  }
}
