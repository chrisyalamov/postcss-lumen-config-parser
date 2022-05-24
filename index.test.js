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
:root[data-theme="dark"] {}`
  await run(base, expected, configuration)
})

it('creates design tokens', async () => {
  let configuration = {
    themes: {
      default: {
        primary: '#000000',
        secondary: '#ffffff'
      },
      dark: {
        primary: '#ffffff',
        secondary: '#000000'
      }
    }
  };

  let expected = `
:root {
    --primary: #000000;
    --secondary: #ffffff
}
:root[data-theme="dark"] {
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
:root[data-theme="dark"] {}
:root .lds-button.success {}
:root[data-theme="dark"] .lds-button.success {}`
  await run(base, expected, configuration)
})

it('creates CSS declarations for component variant styles', async () => {
  let configuration = {
    themes: {
      default: {},
      dark: {}
    },
    components: {
      button: {
        success: {
          default: {
            bg: '#000000',
            borderPrimary: '#000000'
          },
          dark: {
            bg: '#ffffff',
            borderPrimary: '#ffffff'
          }
        }
      }
    }
  };

  let expected = `
:root {}
:root[data-theme="dark"] {}
:root .lds-button.success {
    --lds-bg: #000000;
    --lds-borderPrimary: #000000
}
:root[data-theme="dark"] .lds-button.success {
    --lds-bg: #ffffff;
    --lds-borderPrimary: #ffffff
}`
  await run(base, expected, configuration)
})

it('creates CSS declarations with reference values', async () => {
  // E.g. converting "{green-500}" to "var(--green-500)"
  let configuration = {
    themes: {
      default: {},
      dark: {}
    },
    components: {
      button: {
        success: {
          default: {
            bg: '{green-500}',
            borderPrimary: '{green-400}'
          },
          dark: {
            bg: '{green-300}',
            borderPrimary: '{green-600}'
          }
        }
      }
    }
  };

  let expected = `
:root {}
:root[data-theme="dark"] {}
:root .lds-button.success {
    --lds-bg: var(--green-500);
    --lds-borderPrimary: var(--green-400)
}
:root[data-theme="dark"] .lds-button.success {
    --lds-bg: var(--green-300);
    --lds-borderPrimary: var(--green-600)
}`
  await run(base, expected, configuration)
})
