# CadmusTextEdTxt

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

This library contains Markdown-related plugins for the Cadmus [text editing service](../cadmus-text-ed/README.md).

These plugins can be used to provide shortcuts to frequent edit tasks like toggling bold or italic, or providing more complex logic in assisting edits.

## Plugins

### Insert Unicode Emoji

- 🔑 `txt.emoji` (`TxtEmojiCtePlugin`)

This plugin provides a user-friendly way for inserting Unicode Emoji characters in a text.

You can pass it the name of an emoji, or just an empty text. When the name corresponds to the full name of an existing Emoji, the corresponding text is returned. If instead the text is empty, or it does not match a full name, a dialog pops up and lets you pick the desired emoji, which is then returned as text.
