/**
 * @type {import('postcss').PluginCreator}
 */

const Color = require('color');

let transformers = {
  button: {
    bg: (value, theme, opts) => {
      let template = /\{([a-zA-Z0-9\-_]*)\}/g.exec(value);
      let bg;
      if (template) {
        bg = theme.tokens[template[1]];
      } else {
        bg = value;
      }

      let 
      borderPrimary, 
      borderSecondary,
      bgHover,
      borderPrimaryHover,
      borderSecondaryHover,
      bgActive,
      borderPrimaryActive;

      const color = Color(bg);
      if (theme.mode == "dark") {
        borderPrimary = color.lighten(0.1).hsl();
        borderSecondary = color.lighten(0.2).hsl();
        bg_hover = color.lighten(0.25).hsl();
        borderPrimary_hover = color.lighten(0.3).hsl();
        borderSecondary_hover = color.lighten(0.4).hsl();
        bg_active = color.lighten(0.15).hsl();
        borderPrimary_active = color.lighten(0.2).hsl();
      } else {
        borderPrimary = color.darken(0.1).hsl();
        borderSecondary = color.darken(0.2).hsl();
        bg_hover = color.darken(0.25).hsl();
        borderPrimary_hover = color.darken(0.3).hsl();
        borderSecondary_hover = color.darken(0.4).hsl();
        bg_active = color.darken(0.15).hsl();
        borderPrimary_active = color.darken(0.2).hsl();
      }

      return [
        { prop: '--lds-bg', value: bg },
        { prop: '--lds-borderPrimary-preset', value: borderPrimary.string() },
        { prop: '--lds-borderSecondary-preset', value: borderSecondary.string() },
        { prop: '--lds-bg_hover-preset', value: bg_hover.string() },
        { prop: '--lds-borderPrimary_hover-preset', value: borderPrimary_hover.string() },
        { prop: '--lds-borderSecondary_hover-preset', value: borderSecondary_hover.string() },
        { prop: '--lds-bg_active-preset', value: bg_active.string() },
        { prop: '--lds-borderPrimary_active-preset', value: borderPrimary_active.string() },
      ]
    }
  }
}

module.exports = (opts = {}) => {
  // Work with options here

  // Array with the names of themes
  let themes = Object.keys(opts.themes || {});

  // Array with the names of components
  let components = Object.keys(opts.components || {});

  return {
    postcssPlugin: 'postcss-lumen-config-parser',
    Root (root, postcss) {
      root.walkAtRules(rule => {
        if (rule.name === 'lumen' && rule.params === 'themes') {
          // Create a rule for each theme
          themes.forEach(theme => {
            let selector = theme == "default" ? `:root` : `:root[data-theme="${theme}"]`;
            let rule = postcss.rule({ selector });
            // rule.append({ prop: '--theme', value: `"${theme}"` });
            let themeConfig = opts.themes[theme];
            if(themeConfig.tokens) {
              // If any tokens have been defined in the theme configuration, iterate over them and create CSS variables
              Object.keys(themeConfig.tokens).forEach(prop => {
                rule.append({ prop: `--${prop}`, value: themeConfig.tokens[prop] });
              });
            }
            root.append(rule);
          });
          // Remove the lumen rule
          rule.remove();
        }
        if (rule.name === 'lumen' && rule.params === 'components') {
          // Create a rule for each component variant under each theme
          components.forEach(component => {
            let variants = Object.keys(opts.components[component] || {});
            variants.forEach(variant => {
              // For each variant...
              themes.forEach(theme => {
                // For each theme...

                // E.g. :root[data-theme="brand-default"] .lds-button-danger
                let selector = `${theme == "default" ? `:root` : `:root[data-theme="${theme}"]`} .lds-${component}.${variant}`;
                let rule = postcss.rule({ selector });

                Object.keys(opts.components[component][variant][theme] || {}).forEach(prop => {
                  let value = opts.components[component][variant][theme][prop];
                  let declarations;
                  // If transformers exist for this component-property, use it
                  if (transformers[component] && transformers[component][prop]) {
                    // Run through transformer
                    declarations = transformers[component][prop](value, opts.themes[theme]);
                  } else {
                    let template = /\{([a-zA-Z0-9\-_]*)\}/g.exec(value);
                    if (template) {
                      declarations = [{ prop: `--lds-${prop}`, value: `var(--${template[1]})` }];
                    } else {
                      declarations = [{ prop: `--lds-${prop}`, value: value }];
                    }
                  }
                  rule.append(...declarations);
                });
                root.append(rule);
              })
            })
          })
          rule.remove();
        }
      })
    }

    /*
    Declaration (decl, postcss) {
      // The faster way to find Declaration node
    }
    */

    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}

module.exports.postcss = true
