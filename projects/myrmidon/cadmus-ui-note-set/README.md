# Cadmus UI - Notes Set

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

A fixed set of editable notes, using plain text and/or Markdown. This is used when your model has a set of free text notes, often related, either plain text or Markdown, and you want a compact UI to edit all of them.

## Requirements

This requires [ngx-markdown](https://github.com/jfcere/ngx-markdown):

```bash
npm i ngx-markdown marked --save
npm i @types/marked --save-dev
```

As the library is using Marked parser you will need to add `node_modules/marked/marked.min.js` to your application. If you are using Angular CLI you can add to `scripts`:

```json
"scripts": [
 "node_modules/marked/marked.min.js"
]
```

Also ensure to import `MarkdownModule.forRoot()` in your app module (or use `importProvidersFrom(MarkdownModule.forRoot())` in `app.config.ts` of a standalone app), as `forRoot` injects the required `MarkdownService`.
