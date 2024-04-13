# Cadmus Text Editor Service - Markdown

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

This library contains Markdown-related plugins for the 
Cadmus [text editing service](../cadmus-text-ed/README.md).

These plugins can be used to provide shortcuts to frequent edit tasks like toggling bold or italic, or providing more complex logic in assisting edits.

## Plugins

### Toggle Bold

- 🔑 `md.bold` (`MdBoldCtePlugin`)

This plugin toggles bold text on or off using two asterisks for it. It expects a text, and if it finds a bold span inside it it removes the wrapper asterisks; else, it wraps the text in them.

### Toggle Italic

- 🔑 `md.italic` (`MdItalicCtePlugin`)

This plugin toggles italic text on or off using one asterisk for it. It expects a text, and if it finds a bold span inside it it removes the wrapper asterisks; else, it wraps the text in them.

### Insert Unicode Emoji

- 🔑 `md.emoji` (`MdEmojiCtePlugin`)

This plugin provides a user-friendly way for inserting Unicode Emoji characters in a text.

You can pass it the name of an emoji, or just an empty text. When the name corresponds to the full name of an existing Emoji, the corresponding text is returned. If instead the text is empty, or it does not match a full name, a dialog pops up and lets you pick the desired emoji, which is then returned as text.

## Example

For an example usage with a Monaco editor instance see the [text editor service demo page](../../../src/app/text/text-ed-pg/text-ed-pg.component.ts).
