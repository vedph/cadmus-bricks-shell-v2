import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';

import { ImgAnnotationList, ListAnnotation } from './img-annotation-list';
import { GalleryImage } from '../../directives/img-annotator.directive';

/**
 * Base for image annotations list components. Derive your component from
 * this, wiring its input annotator, editorComponent and image properties.
 * The inner list core is lazily instantiated when these properties are set.
 */
@Directive({ standalone: true })
export abstract class ImgAnnotationListComponent<T> {
  private _annotator?: any;
  private _editorComponent?: any;
  private _image?: GalleryImage;
  private _list?: ImgAnnotationList<T>;

  /**
   * The annotations list empowering this component.
   */
  public get list(): ImgAnnotationList<T> | undefined {
    return this._list;
  }

  /**
   * The annotator object as received from Annotorious.
   */
  @Input({ required: true })
  public get annotator(): any {
    return this._annotator;
  }
  public set annotator(value: any) {
    if (this._annotator === value) {
      return;
    }
    this._annotator = value;
    this.initList();
  }

  /**
   * The component used to edit a ListAnnotation. Pass the component
   * class, e.g. [editorComponent]="MyEditorComponent".
   */
  @Input({ required: true })
  public get editorComponent(): any {
    return this._editorComponent;
  }
  public set editorComponent(value: any) {
    if (this._editorComponent === value) {
      return;
    }
    this._editorComponent = value;
    this.initList();
  }

  /**
   * The image to be annotated.
   */
  @Input({ required: true })
  public get image(): GalleryImage | undefined {
    return this._image;
  }
  public set image(value: GalleryImage | undefined) {
    if (this._image === value) {
      return;
    }
    this._image = value;
    this.initList();
  }

  /**
   * The function used to build a string from a list annotation object,
   * summarizing its content appropriately.
   */
  @Input()
  public annotationToString: (object: ListAnnotation<any>) => string | null;

  /**
   * Emitted when the list is initialized.
   */
  @Output()
  public listInit: EventEmitter<ImgAnnotationList<T>>;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig
  ) {
    this.annotationToString = (a: ListAnnotation<any>) => {
      return a.value.body?.length ? a.value.body[0].value : a.id;
    };
    // events
    this.listInit = new EventEmitter<ImgAnnotationList<T>>();
  }

  protected initList(): void {
    if (this._annotator && this._editorComponent) {
      this._list = new ImgAnnotationList(
        this._annotator,
        this._editorComponent,
        this.dialog,
        this.dlgConfig
      );
      this._list.image = this.image;
      this.listInit.emit(this._list);
    }
  }
}
