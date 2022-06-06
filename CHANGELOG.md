# Change Log

This project uses semantic versioning.

## 1.2.0 - 06/06/2022
### Added
- Support for user-defined generators

### Changed
- Transformers are now referred to as generators

### Removed
- Example transformer— examples will be made available when Lumen becomes public and is documented.

## 1.1.0 - 04/06/2022
### Added
- Framework for transformers
- A sample transformer for a button component
 
## Changed
- **Any** element with a `data-theme` property can now act as a theme provider (before, themes were provided by the `:root` selector which meant only the `<html>` element could act as a theme provider)