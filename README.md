> ⚠️ **Warning**  
> This plugin has little to no application just yet. It's part of a larger project which is not public at this time.

![Cover](./Cover.png)
# Lumen Configuration Parser

[![Actions Status](https://github.com/chrisyalamov/postcss-lumen-config-parser/workflows/Test/badge.svg)](https://github.com/chrisyalamov/postcss-lumen-config-parser/workflows/Test/badge.svg)


A [PostCSS] plugin for generating CSS from a Lumen theme object.

## What is Lumen?
Lumen is **(currently only a concept for a)** design system written in React intended to be accessible, universally applicable and flexible at its core. It uses theme configuration files to allow you to create variants of components, using a structure similar to CSS rules.

## Basics of theming in Lumen
Similar to Tailwind CSS, you can define customisations to your deployment in a configuration object/file.

To find out how to structure your configuration object, check out the [Configuration guide](./Configuration%20guide.md).

[PostCSS]: https://github.com/postcss/postcss

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-lumen-config-parser
```

**Step 2:** Check you project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to the plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-lumen-config-parser'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
