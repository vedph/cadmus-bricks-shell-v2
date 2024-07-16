# CadmusMatPhysicalState

This library contains a component representing the physical preservation state (`PhysicalState`) of some object.

## Component

- 🚩 `cadmus-mat-physical-state`
- 🔑 `PhysicalStateComponent`
- thesauri: `physical-states`, `physical-state-reporters`, `physical-state-features`.

API:

- ▶️ `state` (`PhysicalState | undefined`)
- ▶️ `noRecognition` (`boolean | undefined`)
- ▶️ `stateEntries` (`ThesaurusEntry[] | undefined`)
- ▶️ `reporterEntries` (`ThesaurusEntry[] | undefined`)
- ▶️ `featEntries` (`ThesaurusEntry[] | undefined`)
- 🔥 `stateCancel`
- 🔥 `stateChange` (`PhysicalState`)
