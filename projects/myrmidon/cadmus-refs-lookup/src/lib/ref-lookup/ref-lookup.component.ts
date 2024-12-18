import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { RefLookupOptionsComponent } from '../ref-lookup-options/ref-lookup-options.component';

/**
 * A generic item lookup filter used by RefLookupComponent.
 * You can derive other filters from this interface, which
 * just includes the lookup limit and a text filter.
 */
export interface RefLookupFilter {
  limit: number;
  text: string | undefined;
}

/**
 * The interface to be implemented by lookup services used
 * by RefLookupComponent.
 */
export interface RefLookupService {
  /**
   * Lookup the items matching filter.
   * @param filter The filter.
   * @param options Additional options.
   */
  lookup(filter: RefLookupFilter, options?: any): Observable<any[]>;
  /**
   * Get a display name for the specified item.
   * @param item The item.
   */
  getName(item: any | undefined): string;
}

/**
 * Generic reference lookup component. You must set the service
 * property to the lookup service, implementing the LookupService
 * interface, and eventually the current lookup item. Optionally
 * set the label and limit, and hasMore to true if you want a
 * more button for more complex lookup.
 */
@Component({
  selector: 'cadmus-ref-lookup',
  templateUrl: './ref-lookup.component.html',
  styleUrls: ['./ref-lookup.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class RefLookupComponent implements OnInit {
  private _service: RefLookupService | undefined;
  private _item: any | undefined;
  private _required: boolean | undefined;

  public lookupActive: boolean;
  public invalid$: BehaviorSubject<boolean>;

  /**
   * The label to be displayed in the lookup control.
   */
  @Input()
  public label: string | undefined;

  /**
   * The maximum number of items to retrieve at each lookup.
   * Default is 10.
   */
  @Input()
  public limit: number;

  /**
   * The base filter object to supply when filtering data
   * in this lookup. If you have more filtering criteria
   * set by your client code, set this property to an object
   * representing the filter criteria. This object will be
   * used as the base object when invoking the lookup service.
   */
  @Input()
  public baseFilter: any;

  /**
   * The lookup service to use.
   */
  @Input()
  public get service(): RefLookupService | undefined {
    return this._service;
  }
  public set service(value: RefLookupService | undefined) {
    const dirty = this._service ? true : false;
    this._service = value;
    if (dirty) {
      this.clear();
    }
  }

  /**
   * The current lookup item or undefined.
   */
  @Input()
  public get item(): any | undefined {
    return this._item;
  }
  public set item(value: any | undefined) {
    if (this._item !== value) {
      this._item = value;
      this.updateValidity();
      this.lookup.setValue(value);
    }
  }

  /**
   * True if a value is required.
   */
  @Input()
  public get required(): boolean | undefined {
    return this._required;
  }
  public set required(value: boolean | undefined) {
    this._required = value;
    this.updateValidity();
  }

  /**
   * True to add a More button for more complex lookup.
   * When the user clicks it, the corresponding moreRequest
   * event will be emitted.
   */
  @Input()
  public hasMore: boolean | undefined;

  /**
   * The optional template to be used when building the
   * URI pointing to the external resource and linked by
   * the Link button. The ID placeholder is represented by
   * a property path included in {}, e.g. {id} or {some.id}.
   * If undefined, no link button will be displayed.
   */
  @Input()
  public linkTemplate: string | undefined;

  /**
   * When using quick options, this is a component used to
   * customize the options bound to options.
   */
  @Input()
  public optDialog: any;

  /**
   * The quick options for the lookup service.
   */
  @Input()
  public options: any;

  /**
   * Fired whenever an item is picked up.
   */
  @Output()
  public itemChange: EventEmitter<any | null>;

  /**
   * The request for a more complex lookup, getting the
   * current item if any.
   */
  @Output()
  public moreRequest: EventEmitter<any | undefined>;

  public form: UntypedFormGroup;
  public lookup: UntypedFormControl;
  public items$: Observable<any[]>;

  constructor(formBuilder: UntypedFormBuilder, private _dialog: MatDialog) {
    this.invalid$ = new BehaviorSubject<boolean>(false);
    this.lookupActive = false;
    this.lookup = formBuilder.control(null);
    this.form = formBuilder.group({
      lookup: this.lookup,
    });

    this.limit = 10;
    this.itemChange = new EventEmitter<any>();
    this.moreRequest = new EventEmitter<any>();

    this.items$ = this.lookup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any | string) => {
        if (typeof value === 'string' && this._service) {
          return this._service
            .lookup(
              {
                ...(this.baseFilter || {}),
                limit: this.limit || 10,
                text: value,
              },
              this.options
            )
            .pipe(
              tap((v) => {
                this.invalid$.next(this._required && !v ? true : false);
              })
            );
        } else {
          this.invalid$.next(value ? false : true);
          return of([value]);
        }
      })
    );
  }

  ngOnInit(): void {}

  private updateValidity(): void {
    this.invalid$.next(this._required && !this._item ? true : false);
  }

  public getLookupName(item: any): string {
    return this._service?.getName(item) || '';
  }

  public clear(): void {
    this.item = undefined;
    this.lookup.reset();
    this.lookupActive = false;
    this.itemChange.emit(null);
  }

  public pickItem(item: any): void {
    this.item = item;
    this.lookupActive = false;
    this.itemChange.emit(item);
  }

  public requestMore(): void {
    this.lookupActive = false;
    this.moreRequest.emit(this.item);
  }

  private resolvePlaceholder(value: string): string | null {
    const steps = value.split('.');
    let p: any = this.item;
    for (let i = 0; i < steps.length; i++) {
      p = p[steps[i]];
      if (!p) {
        return null;
      }
    }
    return p?.toString() || null;
  }

  public openLink(): void {
    if (!this.item || !this.linkTemplate) {
      return;
    }

    // find the 1st '{' (there must be one)
    let i = this.linkTemplate.indexOf('{');
    if (i === -1) {
      return;
    }
    const sb: string[] = [];
    let prev = 0;

    while (i > -1) {
      // '{' found: first append left stuff if any
      const start = i + 1;
      if (prev < i) {
        sb.push(this.linkTemplate.substring(prev, i));
      }
      // then find closing '}', assuming it at end
      // if not found (defensive)
      i = this.linkTemplate.indexOf('}', i + 1);
      if (i === -1) {
        i = this.linkTemplate.length;
        break;
      }
      // append the resolved placeholder
      const resolved = this.resolvePlaceholder(
        this.linkTemplate.substring(start, i)
      );
      if (resolved) {
        sb.push(resolved);
      }
      // move to next placeholder
      prev = ++i;
      i = this.linkTemplate.indexOf('{', i);
    }
    const uri = sb.join('');
    if (uri) {
      window.open(uri, '_blank');
    }
  }

  public showOptions(): void {
    if (!this.optDialog) {
      return;
    }
    // open the lookup options dialog using optDialog as its content
    // and passing the options via data
    this._dialog
      .open(RefLookupOptionsComponent, {
        data: {
          component: this.optDialog,
          options: this.options,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        this.options = result;
      });
  }
}
