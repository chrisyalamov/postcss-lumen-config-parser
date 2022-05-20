# Lumen Configuration Parser

A [PostCSS] plugin for generating CSS from a Lumen theme file.

## What is Lumen?
Lumen is a design system written in React which is flexible and customisable at its core. It uses theme configuration files to allow you to set custom values for almost anything.

## Basics of theming in Lumen
Similar to Tailwind CSS, you can define customisations to your deployment in a configuration file.

This file can be in either ```.json``` or ```.yaml``` format.

[PostCSS]: https://github.com/postcss/postcss

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-lumen-config-parser
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-lumen-config-parser'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
