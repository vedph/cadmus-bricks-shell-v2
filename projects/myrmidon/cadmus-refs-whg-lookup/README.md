# CadmusRefsWhgLookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

⚠️ This is a beta because WHG service is still under development.

The [World Historical Gazetteer](https://whgazetteer.org/) API currently provides a suggestion API (undocumented) to get full names from a portion of them (returning an array of strings), and a [search API](https://whgazetteer.org/usingapi/) to search for places from their full name (returning GeoJSON data, which supposedly consist of either a single GeoJSON feature object or of many of them in a features collection).

The WHG lookup component uses first the suggestion API to get a list of matching names; then, for each matched name, it searches it, adjusting the results so that they come out as an array of GeoJSON feature objects, one for each place.
