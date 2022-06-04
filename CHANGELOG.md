# Change Log

This project uses semantic versioning.

## Unreleased
- Transformers for other components 

## 1.1.0 - 04/06/2022
### Added
- Framework for transformers
- A sample transformer for a button component
 
## Changed
- **Any** element with a `data-theme` property can now act as a theme provider (before, themes were provided by the `:root` selector which meant only the `<html>` element could act as a theme provider)