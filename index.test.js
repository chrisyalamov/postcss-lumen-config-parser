const postcss = require('postcss')

const plugin = require('./')

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

it('creates CSS declarations for component variant styles', async () => {
  let configuration = {
    themes: {
      default: {
        mode: "light"
      },
      dark: {
        mode: "dark"
      }
    },
    components: {
      button: {
        success: {
          default: {
            bg: '#e6e6e6',
            borderPrimary: '#bababa'
          },
          dark: {
            bg: '#3b3b3b',
            borderPrimary: '#8c8c8c'
          }
        }
      }
    }
  };

  let expected = `
:root {}
[data-theme="dark"] {}
.lds-button.success {
    --lds-bg: #e6e6e6;
    --lds-borderPrimary-preset: hsl(0, 0%, 81.2%);
    --lds-borderSecondary-preset: hsl(0, 0%, 72.2%);
    --lds-bg_hover-preset: hsl(0, 0%, 67.6%);
    --lds-borderPrimary_hover-preset: hsl(0, 0%, 63.1%);
    --lds-borderSecondary_hover-preset: hsl(0, 0%, 54.1%);
    --lds-bg_active-preset: hsl(0, 0%, 76.7%);
    --lds-borderPrimary_active-preset: hsl(0, 0%, 72.2%);
    --lds-borderPrimary: #bababa
}
[data-theme="dark"] .lds-button.success {
    --lds-bg: #3b3b3b;
    --lds-borderPrimary-preset: hsl(0, 0%, 25.5%);
    --lds-borderSecondary-preset: hsl(0, 0%, 27.8%);
    --lds-bg_hover-preset: hsl(0, 0%, 28.9%);
    --lds-borderPrimary_hover-preset: hsl(0, 0%, 30.1%);
    --lds-borderSecondary_hover-preset: hsl(0, 0%, 32.4%);
    --lds-bg_active-preset: hsl(0, 0%, 26.6%);
    --lds-borderPrimary_active-preset: hsl(0, 0%, 27.8%);
    --lds-borderPrimary: #8c8c8c
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
    --lds-bg: #ff0000;
    --lds-borderPrimary-preset: hsl(0, 100%, 45%);
    --lds-borderSecondary-preset: hsl(0, 100%, 40%);
    --lds-bg_hover-preset: hsl(0, 100%, 37.5%);
    --lds-borderPrimary_hover-preset: hsl(0, 100%, 35%);
    --lds-borderSecondary_hover-preset: hsl(0, 100%, 30%);
    --lds-bg_active-preset: hsl(0, 100%, 42.5%);
    --lds-borderPrimary_active-preset: hsl(0, 100%, 40%);
    --lds-borderPrimary: var(--redDark)
}
[data-theme="dark"] .lds-button.danger {
    --lds-borderPrimary: var(--redVeryDark)
}`
  await run(base, expected, configuration)
})
