import { Routes } from '@angular/router';

import { CodLocationPgComponent } from './cod/cod-location-pg/cod-location-pg.component';
import { HomeComponent } from './home/home.component';
import { ImgAnnotatorPgComponent } from './img/img-annotator-pg/img-annotator-pg.component';
import { ImgAnnotatorToolbarPgComponent } from './img/img-annotator-toolbar-pg/img-annotator-toolbar-pg.component';
import { ImgGalleryPgComponent } from './img/img-gallery-pg/img-gallery-pg.component';
import { SdImgAnnotatorPgComponent } from './img/sd-img-annotator-pg/sd-img-annotator-pg.component';
import { SdImgGalleryPgComponent } from './img/sd-img-gallery-pg/sd-img-gallery-pg.component';
import { PhysicalSizePgComponent } from './mat/physical-size-pg/physical-size-pg.component';
import { AssertedChronotopePgComponent } from './refs/asserted-chronotope-pg/asserted-chronotope-pg.component';
import { AssertedChronotopeSetPgComponent } from './refs/asserted-chronotope-set-pg/asserted-chronotope-set-pg.component';
import { AssertedCompositeIdPgComponent } from './refs/asserted-composite-id-pg/asserted-composite-id-pg.component';
import { AssertedCompositeIdsPgComponent } from './refs/asserted-composite-ids-pg/asserted-composite-ids-pg.component';
import { AssertedIdPgComponent } from './refs/asserted-id-pg/asserted-id-pg.component';
import { AssertedIdsPgComponent } from './refs/asserted-ids-pg/asserted-ids-pg.component';
import { AssertionPgComponent } from './refs/assertion-pg/assertion-pg.component';
import { ChronotopePgComponent } from './refs/chronotope-pg/chronotope-pg.component';
import { DbpediaRefLookupPgComponent } from './refs/dbpedia-ref-lookup-pg/dbpedia-ref-lookup-pg.component';
import { DecoratedCountsPgComponent } from './refs/decorated-counts-pg/decorated-counts-pg.component';
import { DecoratedIdsPgComponent } from './refs/decorated-ids-pg/decorated-ids-pg.component';
import { DocReferencesPgComponent } from './refs/doc-references-pg/doc-references-pg.component';
import { ExternalIdsPgComponent } from './refs/external-ids-pg/external-ids-pg.component';
import { GeonamesRefLookupPgComponent } from './refs/geonames-ref-lookup-pg/geonames-ref-lookup-pg.component';
import { HistoricalDatePgComponent } from './refs/historical-date-pg/historical-date-pg.component';
import { ProperNamePgComponent } from './refs/proper-name-pg/proper-name-pg.component';
import { RefLookupPgComponent } from './refs/ref-lookup-pg/ref-lookup-pg.component';
import { RefLookupSetPgComponent } from './refs/ref-lookup-set-pg/ref-lookup-set-pg.component';
import { ViafRefLookupPgComponent } from './refs/viaf-ref-lookup-pg/viaf-ref-lookup-pg.component';
import { EmojiImePgComponent } from './text/emoji-ime-pg/emoji-ime-pg.component';
import { TextBlockViewPgComponent } from './text/text-block-view-pg/text-block-view-pg.component';
import { TextEdPgComponent } from './text/text-ed-pg/text-ed-pg.component';
import { CustomActionBarPgComponent } from './ui/custom-action-bar-pg/custom-action-bar-pg.component';
import { FlagsPickerPgComponent } from './ui/flags-picker-pg/flags-picker-pg.component';
import { NoteSetPgComponent } from './ui/note-set-pg/note-set-pg.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'img/gallery', component: ImgGalleryPgComponent },
  { path: 'img/sd-gallery', component: SdImgGalleryPgComponent },
  { path: 'img/annotator', component: ImgAnnotatorPgComponent },
  { path: 'img/sd-annotator', component: SdImgAnnotatorPgComponent },
  { path: 'img/toolbar', component: ImgAnnotatorToolbarPgComponent },
  { path: 'refs/doc-references', component: DocReferencesPgComponent },
  { path: 'refs/external-ids', component: ExternalIdsPgComponent },
  {
    path: 'refs/decorated-counts',
    component: DecoratedCountsPgComponent,
  },
  { path: 'refs/decorated-ids', component: DecoratedIdsPgComponent },
  { path: 'refs/proper-name', component: ProperNamePgComponent },
  { path: 'refs/assertion', component: AssertionPgComponent },
  { path: 'refs/asserted-id', component: AssertedIdPgComponent },
  { path: 'refs/asserted-ids', component: AssertedIdsPgComponent },
  {
    path: 'refs/asserted-composite-id',
    component: AssertedCompositeIdPgComponent,
  },
  {
    path: 'refs/asserted-composite-ids',
    component: AssertedCompositeIdsPgComponent,
  },
  { path: 'refs/chronotope', component: ChronotopePgComponent },
  {
    path: 'refs/asserted-chronotope',
    component: AssertedChronotopePgComponent,
  },
  {
    path: 'refs/asserted-chronotope-set',
    component: AssertedChronotopeSetPgComponent,
  },
  { path: 'refs/historical-date', component: HistoricalDatePgComponent },
  { path: 'refs/lookup', component: RefLookupPgComponent },
  { path: 'refs/lookup-set', component: RefLookupSetPgComponent },
  { path: 'refs/viaf-lookup', component: ViafRefLookupPgComponent },
  { path: 'refs/dbpedia-lookup', component: DbpediaRefLookupPgComponent },
  { path: 'refs/geonames-lookup', component: GeonamesRefLookupPgComponent },
  { path: 'ui/flags-picker', component: FlagsPickerPgComponent },
  { path: 'ui/note-set', component: NoteSetPgComponent },
  {
    path: 'ui/custom-actions-bar',
    component: CustomActionBarPgComponent,
  },
  { path: 'text/block-view', component: TextBlockViewPgComponent },
  { path: 'text/emoji-ime', component: EmojiImePgComponent },
  { path: 'text/edit', component: TextEdPgComponent },
  { path: 'mat/physical-size', component: PhysicalSizePgComponent },
  { path: 'cod/location', component: CodLocationPgComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];
