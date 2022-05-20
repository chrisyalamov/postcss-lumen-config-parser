# Configuration guide

## Introduction
Lumen is intended to be a flexible design system, making it compatible with all kinds of projects.

The system comes with a pre-defined theme, including a pre-defined colour scheme, component styles, settings for shadows, typography, etc.

You can customise these as much (or as little) as you like by using a Lumen configuration file. This can be a ```.json``` or ```.yaml``` file.

## What happens behind the scenes
> 📘 Looking to get started with Lumen quickly?
> 
> Skip past this section.

Lumen makes extensive use of CSS variables. Truly— they're everywhere.

At the top level of a Lumen configuration, you have **themes**. A theme houses:
- Tokens for
    - Colours
    - Spacing
    - Shadows
    - Typography
    - etc.
- Component stylesets

A component styleset is a set of properties, very similar to a CSS rule. For instance, you might want to define a custom border colour for a particular component. You can define custom values for various themes, for example

```yaml
components:
    button:
        default:
            bg: "{brand-500}"
            borderPrimary: "{brand-400}"
        dark:
            bg: "{brand-400}"
            borderPrimary: "{brand-300}"

```

As common practice dictates, CSS variables are *mostly* defined under the ```:root``` selector. This is where your core theme lives.

```css
:root {
    /* Examples of setting colours */
    --brand-primary-raw: 26, 44, 240;
    --brand-primary: rgb(26, 44, 240);

    /* Examples of global spacing options */
    --padding-multiplier-top: 1;
    --padding-multiplier-right: 1.5;
    --padding-multiplier-bottom: 1;
    --padding-multiplier-left: 1.5;

    /* Examples of component variant definitions */
    --button-cta-bg: #8a0a59;
    --button-cta-borderPrimary: #730e4c;
    --button-cta-borderSecondary: #4a042f;

    --panel-main-bg: var(--brand-primary);
}
```

You may have additional themes, the variables for which will live in a selector that looks like this:

```css
:root[data-theme="{theme name}"] {
    ...
}
```

You can then apply a specific theme by applying a data prop to your ```<html>``` element:

```html
<html data-theme="{theme name}">
    ...
</html>
```

> 🚧 Dark mode
> 
> If a particular theme is intended for use with dark mode, ensure you also include the following data prop in your html element:
> ```html
> <html data-theme="{theme name}" data-mode="dark">
>    ...
> </html>
> ```

> 🚧 Layering
> 
> It's very important to understand that Lumen will always apply themes in the following order:
> - Built-in styles (Lumen)
> - Styles from your ```default``` theme
> - Styles from the theme applied to the ```<html>``` element.
> 
> This means that themes are **not** applied in isolation. Instead, they build on top of built-in Lumen styles and your ```default``` theme. 


Of course, defining CSS variables and applying them throughout your project can get complicated quickly. The Lumen PostCSS plugin provides a level of abstraction to help with this.

In your configuration file, you would first define your themes and the core values used within those themes.

```yaml
themes:
    default:
        colours:
            brand-100: "rgb(26, 44, 240)"
            brand-200: "rgb(12, 24, 210)"
            ...
        paddingMultiplierGlobal:
            x: 1.9
            y: 1.2
    dark:
        colours:
            brand-100: "rgb(99, 35, 75)"
            brand-200: "rgb(117, 21, 80)"
            ...

```

Then, you can start to define stylesets for different components.

```yaml
stylesets:
    button:                             #component
        cta:                            #variant
            default:                    #theme-default
                bg: "{brand-400}"
                border: "{brand-300}"
            dark:                       #theme-dark
                bg: "{brand-300}"       #reference value
                border: "#47313f"       #absolute value
            
```

Then the Lumen PostCSS plugin would convert this into CSS variables.

```css
:root {
    --brand-100-raw: 26, 44, 240;
    --brand-100: rgb(26, 44, 240);
    --brand-200-raw: 117, 21, 80;
    --brand-200: rgb(117, 21, 80);
    /* ... */
    --padding-multiplier-global-l: 1.9;
    --padding-multiplier-global-r: 1.9;
    --padding-multiplier-global-t: 1.2;
    --padding-multiplier-global-b: 1.2;
}

:root .lds-button.cta {
    --bg: var(--brand-400);
    --border: var(--brand-300);
}

:root[data-theme="dark"] .lds-button.cta {
    --bg: var(--brand-300);
    --border: var(--brand-200);
}
```