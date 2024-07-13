# CadmusMatPhysicalGrid

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

This library contains a component representing a bounding rectangle ideally overlaid on top of a 2D physical surface. The surface of the rectangle is covered by a grid, where columns are labeled with letters like in an Excel spreadsheet, and rows are numbered. So, each cell in it can be identified by the combination of column label and row number, just like a cell in a spreadsheet.

This is typically used to roughly divide the surface into cells, and locate parts of it via cell coordinates. This approach for labelling parts of a surface is used in many scenarios where it is necessary to provide a location strategy for its fragments; for instance this happens for fragments from inscriptions or manuscripts. A typical 3x3 grid for example allows to tell whether a fragment belongs to any of the edges or corners, or belongs to an inner portion of a fragmentary object.

This general component allows you to specify the location of 1 or more cells, according to different modes:

- single: you can select only 1 cell at a time.
- multiple: you can select as many cells as you want.
- contiguous (default): you can select 1 or more cells as far as they are contiguous.
