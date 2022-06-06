/**
 * @type {import('postcss').PluginCreator}
 */

module.exports = (opts = {}) => {
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
            let selector = theme == "default" ? `:root` : `[data-theme="${theme}"]`;
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

                // E.g. [data-theme="brand-default"] .lds-button-danger
                let selector = `${theme == "default" ? `` : `[data-theme="${theme}"] `}.lds-${component}.${variant}`;
                let rule = postcss.rule({ selector });

                Object.keys(opts.components[component][variant][theme] || {}).forEach(prop => {
                  let value = opts.components[component][variant][theme][prop];
                  let declarations = [];

                  let template = /\{([a-zA-Z0-9\-_]*)\}/g.exec(value);
                  if (template) {
                    declarations.push({ prop: `--lds-${prop}`, value: `var(--${template[1]})` });
                  } else {
                    declarations.push({ prop: `--lds-${prop}`, value: value });
                  }

                  // If transformers exist for this component-property, use them
                  let applicableGenerators = (opts.generators || []).filter(generator => generator.component == component && (generator.property == prop || "*"));
                  if (applicableGenerators.length) {
                    // Run through generators
                    applicableGenerators.forEach(generator => {
                      declarations.push(...generator.run(value, opts.themes[theme]));
                    });
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
