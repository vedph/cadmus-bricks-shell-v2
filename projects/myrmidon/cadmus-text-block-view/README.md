# CadmusTextBlockView

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

The text blocks view displays a text modeled as a sequence of blocks. Each block implements the `TextBlock` interface, including these properties:

- `id`: some ID for the block.
- `text`: the block's plain text.
- `decoration`: optional decoration to add to this text. This can be plain text or HTML (including SVG).
- `tip`: optional tip to be rendered as HTML title attribute on the decoration element.
- `htmlDecoration`: true if decoration is HTML.
- `layerIds`: array of layer IDs this block is linked to.

The text is displayed by appending one block after the other, with text above and decoration below.

Input properties:

- `blocks`: the text blocks.
- `selectedIds`: optional layer IDs to be initially selected.

Events:

- `blockClick`: emitted when a block is clicked. The handler gets an object including the block itself and a decoration flag which is true if user clicked on the block's decoration rather than on its text.

Typically you set CSS styles for blocks layers in the app's styles, one class per layer ID. Note that if you are matching class names partially, e.g. all the classes starting with `layer-p`, you must take into account the possibility that the class name does not appear as first in the class attribute, e.g. use a couple of selectors like
`div[class^="layer-p"], div[class*=" layer-p"]` (note the space in the second selector).

As this component might need a lot of style customization, the component has no encapsulation and just defines some basic styling using these classes:

- `cadmus-text-block-view-row`: applied to the full row of the view.
- `cadmus-text-block-view-col`: applied to each column in the row. A column includes the text and its decoration.
- `cadmus-text-block-view-d`: applied to the decoration.
- `cadmus-text-block-view-t`: applied to the text.

You can thus set encapsulation: `ViewEncapsulation.None` for the host component and customize styles there.
