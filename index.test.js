const postcss = require('postcss')

const plugin = require('./')

const Color = require('color');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined
  })
  expect(result.css.trim()).toEqual(output.trim())
  expect(result.warnings()).toHaveLength(0)
}

let base = `
@lumen themes;
@lumen components;
`

it('creates CSS rules for themes', async () => {
  let configuration = {
    themes: {
      default: {},
      dark: {}
    }
  };

  let expected = `
:root {}
[data-theme="dark"] {}`
  await run(base, expected, configuration)
})

it('creates design tokens', async () => {
  let configuration = {
    themes: {
      default: {
        tokens: {
          primary: '#000000',
          secondary: '#ffffff'
        }
      },
      dark: {
        tokens: {
          primary: '#ffffff',
          secondary: '#000000'
        }
      }
    }
  };

  let expected = `
:root {
    --primary: #000000;
    --secondary: #ffffff
}
[data-theme="dark"] {
    --primary: #ffffff;
    --secondary: #000000
}`
  await run(base, expected, configuration)
})

it('creates CSS rules for component variants', async () => {
  let configuration = {
    themes: {
      default: {},
      dark: {}
    },
    components: {
      button: {
        success: {
          default: {

          },
          dark: {

          }
        }
      }
    }
  };

  let expected = `
:root {}
[data-theme="dark"] {}
.lds-button.success {}
[data-theme="dark"] .lds-button.success {}`
  await run(base, expected, configuration)
})

it('applies generator functions', async () => {
  let configuration = {
    generators: [
      {
        component: 'button',
        property: 'bg',
        run: 
        (value, theme) => {
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
              bg_hover,
              borderPrimary_hover,
              borderSecondary_hover,
              bg_active,
              borderPrimary_active;
        
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
    ],
    themes: {
      default: {},
      dark: {}
    },
    components: {
      button: {
        success: {
          default: {
            bg: 'green',
            borderSecondary: 'lime'
          },
          dark: {
            bg: 'darkgreen'
          }
        }
      }
    }
  };

  let expected = `
:root {}
[data-theme="dark"] {}
.lds-button.success {
    --lds-bg: green;
    --lds-borderPrimary-preset: hsl(120, 100%, 22.6%);
    --lds-borderSecondary-preset: hsl(120, 100%, 20.1%);
    --lds-bg_hover-preset: hsl(120, 100%, 18.8%);
    --lds-borderPrimary_hover-preset: hsl(120, 100%, 17.6%);
    --lds-borderSecondary_hover-preset: hsl(120, 100%, 15.1%);
    --lds-bg_active-preset: hsl(120, 100%, 21.3%);
    --lds-borderPrimary_active-preset: hsl(120, 100%, 20.1%);
    --lds-borderSecondary: lime
}
[data-theme="dark"] .lds-button.success {
    --lds-bg: darkgreen;
    --lds-borderPrimary-preset: hsl(120, 100%, 17.6%);
    --lds-borderSecondary-preset: hsl(120, 100%, 15.7%);
    --lds-bg_hover-preset: hsl(120, 100%, 14.7%);
    --lds-borderPrimary_hover-preset: hsl(120, 100%, 13.7%);
    --lds-borderSecondary_hover-preset: hsl(120, 100%, 11.8%);
    --lds-bg_active-preset: hsl(120, 100%, 16.7%);
    --lds-borderPrimary_active-preset: hsl(120, 100%, 15.7%)
}`
  await run(base, expected, configuration)
})

it('creates CSS declarations with reference values', async () => {
  // E.g. converting "{green-500}" to "var(--green-500)"
  let configuration = {
    themes: {
      default: {
        mode: "light",
        tokens: {
          red: '#ff0000',
          redDark: '#de1212',
          redVeryDark: '#b30b0b'
        }
      },
      dark: {
        mode: "dark",
        tokens: {
          red: '#ff0000',
          redDark: '#752b2b',
          redVeryDark: '#400606'
        }
      }
    },
    components: {
      button: {
        danger: {
          default: {
            bg: '{red}',
            borderPrimary: '{redDark}'
          },
          dark: {
            borderPrimary: '{redVeryDark}'
          }
        }
      }
    }
  };

  let expected = `
:root {
    --red: #ff0000;
    --redDark: #de1212;
    --redVeryDark: #b30b0b
}
[data-theme="dark"] {
    --red: #ff0000;
    --redDark: #752b2b;
    --redVeryDark: #400606
}
.lds-button.danger {
    --lds-bg: var(--red);
    --lds-borderPrimary: var(--redDark)
}
[data-theme="dark"] .lds-button.danger {
    --lds-borderPrimary: var(--redVeryDark)
}`
  await run(base, expected, configuration)
})
