# Cadmus Bricks Shell V2

👀 [Bricks Demo](https://cadmus-bricks.fusi-soft.com): an online demo showing all the bricks in action. Just pick the desired one from the menu and play with it.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.3. It is a shell for incubating a number of Cadmus sub-models, implemented as Angular components with their editing UI.

This shell is derived from version 1 by refactoring all the libraries into standalone, and updating all the dependencies. Apart from these changes and minor improvements in the libraries, and additions to Markdown plugins, version 2 is the same as version 1.

To maintain compatibility with existing projects, this new version has been added side to side to the original [version 1](https://github.com/vedph/cadmus-bricks-shell). This allows existing projects still use version 1 until they find some time to migrate to version 2.

All the libraries in this repository have bumped their major version number to `5`. So, any version-5 and beyond library belongs to shell V2. Shell V1 will get fixes, but new features will be added to V2.

As Cadmus projects increase, the prototype code reveals more and more portions which can be developed as shared, reused UI components: these are the bricks, i.e. sub-model editor components shared by many projects. Each brick or set of bricks is grouped in a single library, which can be imported in your Cadmus frontend project.

>⚠️ Note that some of the bricks require additional third-party libraries. See the documentation about each library for details.

🐋 Quick **Docker image** build (the only purpose of this image is letting testers play with controls in the incubator):

1. `npm run build-lib`.
2. ensure to update the version in `env.js` (and `docker-compose.yml`), and `ng build --configuration production`.
3. `docker build . -t vedph2020/cadmus-bricks-app:5.1.5 -t vedph2020/cadmus-bricks-app:latest` (replace with the current version).

Use [publish.bat](publish.bat) to publish the libraries to NPM.

## Libraries

- [@myrmidon/cadmus-cod-location](./projects/myrmidon/cadmus-cod-location/README.md): codicologic location.
- [@myrmidon/cadmus-img-annotator](./projects/myrmidon/cadmus-img-annotator/README.md): image annotation.
- [@myrmidon/cadmus-img-gallery](./projects/myrmidon/cadmus-img-gallery/README.md): images gallery for annotations.
- [@myrmidon/cadmus-img-gallery-iiif](./projects/myrmidon/cadmus-img-gallery-iiif/README.md): IIIF implementation of images gallery for annotation.
- [@myrmidon/cadmus-mat-physical-grid](./projects/myrmidon/cadmus-mat-physical-grid/README.md)
- `@myrmidon/cadmus-mat-physical-size`
- [@myrmidon/cadmus-mat-physical-state](./projects/myrmidon/cadmus-mat-physical-state/README.md)
- `@myrmidon/cadms-refs-asserted-chronotope`
- [@myrmidon/cadmus-refs-asserted-ids](./projects/myrmidon/cadmus-refs-asserted-ids/README.md)
- `@myrmidon/cadmus-refs-assertion`
- `@myrmidon/cadmus-refs-chronotope`
- [@myrmidon/cadmus-refs-dbpedia-lookup](./projects/myrmidon/cadmus-refs-dbpedia-lookup/README.md)
- `@myrmidon/cadmus-refs-decorated-counts`
- `@myrmidon/cadmus-refs-decorated-ids`
- `@myrmidon/cadmus-refs-doc-references`
- `@myrmidon/cadmus-refs-external-ids`
- [@myrmidon/cadmus-refs-geonames-lookup](./projects/myrmidon/cadmus-refs-geonames-lookup/README.md)
- `@myrmidon/cadmus-refs-historical-date`
- [@myrmidon/cadmus-refs-lookup](./projects/myrmidon/cadmus-refs-lookup/README.md)
- [@myrmidon/cadmus-refs-proper-name](./projects/myrmidon/cadmus-refs-proper-name/README.md)
- [@myrmidon/cadmus-refs-viaf-lookup](./projects/myrmidon/cadmus-refs-viaf-lookup/README.md)
- [@myrmidon/cadmus-refs-whg-lookup](./projects/myrmidon/cadmus-refs-whg-lookup/README.md)
- `@myrmidon/cadmus-sdimg-annotator`
- `@myrmidon/cadmus-sdimg-gallery`
- [@myrmidon/cadmus-text-block-view](./projects/myrmidon/cadmus-text-block-view/README.md)
- [@myrmidon/cadmus-text-ed](./projects/myrmidon/cadmus-text-ed/README.md)
- [@myrmidon/cadmus-text-ed-md](./projects/myrmidon/cadmus-text-ed-md/README.md)
- [@myrmidon/cadmus-text-ed-txt](./projects/myrmidon/cadmus-text-ed-txt/README.md)
- `@myrmidon/cadmus-ui-custom-action-bar`
- [@myrmidon/cadmus-ui-flags-picker](./projects/myrmidon/cadmus-ui-flags-picker/README.md)
- [@myrmidon/cadmus-ui-note-set](./projects/myrmidon/cadmus-ui-note-set/README.md)

## Adding a Brick

To add a brick:

1. add a library project to this workspace: `ng g library @myrmidon/LIBNS-LIBNAME --prefix cadmus-LIBNS`.
2. add a control in the library.
3. add a corresponding host page in the app, with its menu and route.

## Migration from V1

Migrating to version 2 implies these changes:

1. **update all the references** to brick libraries to version `5.x.x`.
2. **change the imports** to import specific components, pipes or services rather than modules. As previous code referenced the libraries via modules, and V2 libraries no longer have them, a compilation error will be issued, so you don't risk to make confusions.

⚠️ Additionally, V2 has replaced `ngx-monaco-editor-v2` and `ngx-markdown` with libraries from [NG essentials](https://cisstech.github.io/nge/). So it is recommended to replace your app's libraries with these, as specified below.

### Monaco

(1) replace `ngx-markdown-editor-v2` with `@cisstech/nge monaco-editor`. Also remove the corresponding `glob` for Monaco in `angular.json` if present.

```bash
npm uninstall ngx-monaco-editor-v2 --force
npm i @cisstech/nge monaco-editor --force
```

(2) instead of importing `MonacoEditorModule`, import `NgeMonacoModule` in the app's module or `appConfig`. Then, also import `NgeMonacoModule` (of course, without `forRoot`) wherever you use it.

```ts
import { NgeMonacoModule } from '@cisstech/nge/monaco';

// in your imports, add:
// NgeMonacoModule.forRoot({})
```

>To quickly find all the parts using Monaco, usually you can look for `MonacoEditorModule` in code, and for `<ngx-monaco-editor` in templates.

(3) add lower level code for using Monaco, as sampled below. Essentially this means creating a model and setting it in the Monaco editor creation event handler. Typically you will also want to store the reference to the received editor object for later usage. To make this light wrapper as near as possible to the underlying Monaco editor instance, there is no text binding. So, text is handled as follows:

- set text like `this._editorModel.setValue('some text')`. When you init the editor, you can also set an initial text in `createModel`.
- get text whenever it changes, by handling model's `onDidChangeContent` event; in the handler use model's `getValue()` to get the text. This implies implementing `ngOnDestroy` for event handler cleanup as in the sample below.

>The Monaco wrapper was replaced to get closer to the underlying editor, and to avoid issues with the original library, which has been left behind. There also seems to be an issue when building Angular + the old Monaco wrapper, because of webpack not being able to load TTF files from the Monaco package. As a temporary workaround, you could just patch the Monaco library manually:

1. open `node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.css:9:6:`
2. comment out line 9 (I don't need icons in Monaco):

```css
@font-face {
  font-family: "codicon";
  font-display: block;
  /* src: url(./codicon.ttf) format("truetype"); */
}
```

Anyway, it is recommended to switch to the new wrapper, which is more streamlined and up to date.

#### Monaco - Lower Level Code

Example template:

```html
<nge-monaco-editor
  style="--editor-height: 400px;"
  (ready)="onCreateEditor($event)"/>
```

```ts
import { Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implement OnDestroy {
    private readonly _disposables: monaco.IDisposable[] = [];
    private _editorModel?: monaco.editor.ITextModel;
    private _editor?: monaco.editor.IStandaloneCodeEditor;

    public ngOnDestroy() {
        this._disposables.forEach(d => d.dispose());
    }

    public onCreateEditor(editor: monaco.editor.IEditor) {
        editor.updateOptions({
            minimap: {
                side: 'right'
            },
            wordWrap: 'on',
            automaticLayout: true            
        });
        this._editorModel = this._editorModel || monaco.editor.createModel('# Hello world', 'markdown');
        editor.setModel(this._editorModel);
        this._editor = editor as monaco.editor.IStandaloneCodeEditor;

        this._disposables.push(
            this._editorModel.onDidChangeContent(e => {
                console.log(this._editorModel!.getValue());
                // you can set some FormControl like e.g.:
                // this.text.setValue(this._editorModel!.getValue());
                // this.text.markAsDirty();
                // this.text.updateValueAndValidity();
            })
        );

        // example binding
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => {
            console.log('SAVE');
        });
    }
}
```

>You can remove the `editorOptions` property bound to the old wrapper as it is no more required.

### Markdown

(1) replace `ngx-markdown` with [nge-markdown](https://cisstech.github.io/nge/docs/nge-markdown/getting-started): uninstall the former library and install the latter. Keep `marked`, as it's a dependency for both.

```bash
npm uninstall ngx-markdown --force
npm i nge-markdown --force
```

(2) remove the `NgxMarkdownModule.forRoot()` import from the app module and `MarkdownModule.forChild()` from the children modules.

(3) just import `NgeMarkdownModule` in the component/module requiring it (via `import { NgeMarkdownModule } from '@cisstech/nge/markdown';`):

```ts
import { NgeMarkdownModule } from '@cisstech/nge/markdown';

// in your imports, add:
// NgeMarkdownModule
```

>The corresponding selector in templates for the old `NgxMarkdownModule` component is `markdown`.

(4) to display MD via binding: `<nge-markdown [data]="text.value || undefined"></nge-markdown>`.

## Derivation

This is derived from [Cadmus bricks shell v1](https://github.com/vedph/cadmus-bricks-shell) by recreating a workspace in Angular 17 and adding libraries to it (via `ng g library`):

```bash
npm i @myrmidon/auth-jwt-admin @myrmidon/auth-jwt-login @myrmidon/cadmus-api @myrmidon/cadmus-core @myrmidon/ngx-mat-tools @myrmidon/ngx-tools @myrmidon/paged-data-browsers @recogito/annotorious @recogito/annotorious-openseadragon @recogito/annotorious-selector-pack gravatar marked monaco-editor ngx-markdown ngx-monaco-editor-v2 openseadragon

npm i @types/marked @types/openseadragon --save-dev

ng g library @myrmidon/cadmus-cod-location --prefix cadmus
ng g library @myrmidon/cadmus-img-annotator --prefix cadmus
ng g library @myrmidon/cadmus-img-gallery --prefix cadmus
ng g library @myrmidon/cadmus-img-gallery-iiif --prefix cadmus
ng g library @myrmidon/cadmus-mat-physical-size --prefix cadmus
ng g library @myrmidon/cadmus-refs-asserted-chronotope --prefix cadmus
ng g library @myrmidon/cadmus-refs-asserted-ids --prefix cadmus
ng g library @myrmidon/cadmus-refs-assertion --prefix cadmus
ng g library @myrmidon/cadmus-refs-chronotope --prefix cadmus
ng g library @myrmidon/cadmus-refs-dbpedia-lookup --prefix cadmus
ng g library @myrmidon/cadmus-refs-decorated-counts --prefix cadmus
ng g library @myrmidon/cadmus-refs-decorated-ids --prefix cadmus
ng g library @myrmidon/cadmus-refs-doc-references --prefix cadmus
ng g library @myrmidon/cadmus-refs-external-ids --prefix cadmus
ng g library @myrmidon/cadmus-refs-historical-date --prefix cadmus
ng g library @myrmidon/cadmus-refs-lookup --prefix cadmus
ng g library @myrmidon/cadmus-refs-proper-name --prefix cadmus
ng g library @myrmidon/cadmus-refs-viaf-lookup --prefix cadmus
ng g library @myrmidon/cadmus-sdimg-annotator --prefix cadmus
ng g library @myrmidon/cadmus-sdimg-gallery --prefix cadmus
ng g library @myrmidon/cadmus-text-block-view --prefix cadmus
ng g library @myrmidon/cadmus-text-ed --prefix cadmus
ng g library @myrmidon/cadmus-text-ed-md --prefix cadmus
ng g library @myrmidon/cadmus-ui-custom-action-bar --prefix cadmus
ng g library @myrmidon/cadmus-ui-flags-picker --prefix cadmus
ng g library @myrmidon/cadmus-ui-note-set --prefix cadmus
```

Then, the code for each library has been imported except for their module, and each component or directive has been refactored for standalone. Also, `@myrmidon` peer dependencies have been explicitly added to those libraries implying them.

## History

- 2024-12-12:
  - updated Angular and packages.
  - added `@myrmidon/cadmus-ui-flag-set`. This will replace `@myrmidon/cadmus-ui-flags-picker`, providing the following advantages on it:
    - much easier usage pattern: just add the component and its bindings, no need for services.
    - flags can have colors.
    - flags can be configured to automatically uncheck specific flags when checked.

### 7.0.1

- 2024-12-02: ⚠️ replaced `@myrmidon/ng-tools` and `@myrmidon/ng-mat-tools` with `@myrmidon/ngx-tools` and `@myrmidon/ngx-mat-tools`. These are the standalone versions of the older libraries, so you must update your dependencies and references when upgrading.

### 6.0.1

- 2024-11-22: ⚠️ upgraded to Angular 19.
- 2024-11-21: better UI and pipe for proper name.
- 2024-09-27: updated Angular and packages.
- 2024-07-29:
  - updated Angular and packages.
  - fixed icon color in asserted composite IDs.

### 5.1.5

- 2024-07-16: added physical state (`@myrmidon/cadmus-mat-physical-state`).
- 2024-07-15: added service for physical grid.
- 2024-07-12: added `@myrmidon/cadmus-mat-physical-grid`.

### 5.1.4

- 2024-06-29:
  - added WHG lookup (new library: `@myrmidon/cadmus-refs-whg-lookup`).
  - style fixes in `@myrmidon/cadmus-refs-asserted-ids`.
- 2024-06-24: added text parsing to physical size (`@myrmidon/cadmus-mat-physical-size` version 5.1.4).
- 2024-06-23: fixes to physical measurements set (`@myrmidon/cadmus-mat-physical-size` version 5.1.2).
- 2024-06-22:
  - added physical measurements set (`@myrmidon/cadmus-mat-physical-size` version 5.1.1).
  - fixed not allowed decimals in physical size.

### 5.1.3

- 2024-06-09:
  - fixed colors in link editor (`@myrmidon/cadmus-text-ed-md`).
  - fixed layout in a few libraries.
  - applied [M3 theming](https://material.angular.io/guide/theming) to the shell app.
- 2024-06-07: added `class="mat-X"` for each `color="X"` (e.g. `class="mat-primary"` wherever there is a `color="primary"`) to allow transitioning to Angular Material M3 from M2. This also implies adding it directly to the target element, so in the case of `mat-icon` inside a `button` with `color` the class is added to `mat-icon` directly (unless the button too has the same color). This allows to keep the old M2 clients while using the new M3, because it seems that the compatibility mixin is not effective in some cases like inheritance of `color`, and in the future `color` will be replaced by `class` altogether.
- 2024-06-05:
  - added optional label to `AssertedId` (`@myrmidon/cadmus-refs-asserted-ids` 5.1.3). This corresponds to the addition of the same property to the backend `ExternalId` model, which there is the parent class of `AssertedId`.
  - updated packages.

### 5.1.2

- 2024-05-24:
  - updated packages.
  - minor fixes in templates.
  - added automatic scope selection in external lookup when dealing with a multiple lookups set.
  - fixes to DBPedia service and improved test page.
  - added `url` parameter to GeoNames service.
  - added GeoNames service test page.

### 5.1.0

- 2024-05-23:
  - ⚠️ updated to Angular 18 and updated all peer dependencies, bumping versions to 5.1.0.
  - fixed dismiss dialog for link text plugin (`@myrmidon/cadmus-text-ed-md`).
  - updated to new control flow syntax.
- 2024-05-08:
  - fixed missing export in DBPedia lookup.
  - ⚠️ moved Emoji plugin from MD to plain text plugins (`@myrmidon/cadmus-text-ed-txt`).
- 2024-04-30: fixes to link CTE plugin.
- 2024-04-29:
  - fixes to OSD gallery. Still having issues with OSD in the demo.
  - fixes to link plugin in `@myrmidon/cadmus-text-ed-md`.
  - added `withJsonpSupport()` to demo app config to work with VIAF JSONP.
- 2024-04-28:
  - updated Angular.
  - fixes to OSD import.
  - more documentation for gallery.

### 5.0.2

- 2024-04-19: added [GeoNames](https://www.geonames.org/export/web-services.html) service and lookup service.
