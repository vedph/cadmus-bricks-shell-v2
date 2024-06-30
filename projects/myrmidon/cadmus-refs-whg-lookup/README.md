# CadmusRefsWhgLookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

⚠️ This is a beta because WHG service is still under development.

The [World Historical Gazetteer](https://whgazetteer.org/) API currently provides a suggestion API (undocumented) to get full names from a portion of them (returning an array of strings), and a [search API](https://whgazetteer.org/usingapi/) to search for places from their full name (returning GeoJSON data, which supposedly consist of either a single GeoJSON feature object or of many of them in a features collection).

The WHG lookup component uses first the suggestion API to get a list of matching names; then, for each matched name, it searches it, adjusting the results so that they come out as an array of GeoJSON feature objects, one for each place.

## Adding WHG

1. `npm i @myrmidon/cadmus-refs-whg-lookup --force`.
2. add the WHG user name to your environment object:

    ```ts
    export const environment = {
      production: false,
      // ...
      whgUserName: 'myrmex'
    };
    ```

3. add the WHG user token injection in your `app.config.ts` (or `app.module.ts` if still using module-based apps):

    ```ts
    providers: [
      {
        provide: WHG_USERNAME_TOKEN,
        useValue: environment.whgUserName,
      },
    ]
    ```

4. add the WHG configuration globally in `app.component.ts`, or in the component where you consume it, e.g.:

    ```ts
    export class AppComponent {
      public version: string;

      constructor(
        env: EnvService,
        storage: RamStorageService,
        viaf: ViafRefLookupService,
        geonames: GeoNamesRefLookupService,
        whg: WhgRefLookupService
      ) {
        this.version = env.get('version') || '';
        // configure external lookup for asserted composite IDs
        storage.store(ASSERTED_COMPOSITE_ID_CONFIGS_KEY, [
          // ...
          {
            name: 'whg',
            iconUrl: '/assets/img/whg128.png',
            description: 'World Historical Gazetteer',
            label: 'ID',
            service: whg,
            itemIdGetter: (item: GeoJsonFeature) => item?.properties.place_id,
            itemLabelGetter: (item: GeoJsonFeature) => item?.properties.title,
          },
        ] as RefLookupConfig[]);
      }
    }
    ```

5. add the `whg128.png` icon (get it from this workspace) to your `public/img` folder (or `assets/img` if using the old template).
