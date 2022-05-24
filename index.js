/**
 * @type {import('postcss').PluginCreator}
 */
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
            // Iterating over the design tokens under the theme
            Object.keys(themeConfig).forEach(prop => {
              rule.append({ prop: `--${prop}`, value: themeConfig[prop] });
            });
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
                  let template = /\{([a-zA-Z0-9\-\_]*)\}/g.exec(value);
                  if (template) {
                    rule.append({ prop: `--lds-${prop}`, value: `var(--${template[1]})` });
                  } else {
                    rule.append({ prop: `--lds-${prop}`, value: value });
                  }
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
