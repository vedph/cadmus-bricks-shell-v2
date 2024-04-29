# CadmusRefsViafLookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

This is preliminary work. This should wrap VIAF for quick lookup. TODO: add VIAF options component, and use query to allow users pick a subject and/or an index.

⚠️ Note that VIAF requires JSONP, and thus also `HttpClientJsonpModule`. Also, be sure to import this module before the `HttpClientModule` (Angular bug). If using standalone, in `appConfig` be sure to add JSONP like this:

```ts
provideHttpClient(withJsonpSupport())
```
