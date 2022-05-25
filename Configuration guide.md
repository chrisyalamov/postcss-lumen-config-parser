# Configuration guide

## Introduction
Lumen is intended to be a flexible design system, making it compatible with all kinds of projects.

The system comes with a pre-defined theme, including a pre-defined colour scheme, component styles, settings for shadows, typography, etc.

You can customise these as much (or as little) as you like by using a Lumen configuration object, which is passed to the PostCSS plugin.

## How to structure your Lumen configuration

1. **Themes**  

    At the top level of a Lumen configuration, you have **themes**. A theme houses design tokens, for instance for colours, shadows, dimensions, etc.  

    ```yaml
    themes:
        default:
            brand-100: "rgb(26, 44, 240)"
            brand-200: "rgb(12, 24, 210)"
            sm: "0.8em"
            md: "1.1em"
            lg: "1.4em"
            ...
        dark:
            brand-100: "rgb(99, 35, 75)"
            brand-200: "rgb(117, 21, 80)"
            ...

    ```  
    You can then apply a specific theme by applying a data prop to your React ```<App>``` element (or whichever other element is at the top level of the document):  
    ```html
    <App data-theme="{theme name}">
        ...
    </App>
    ```

    If you have a theme called ```default```, it will be applied without you having to specify the data prop.

    > 🚧 Dark mode
    > 
    > If a particular theme is intended for use with dark mode, ensure you also include the following data prop in your ```<App>``` element:
    > ```html
    > <App data-theme="{theme name}" data-mode="dark">
    >    ...
    > </App>
    > ```

    > 🚧 Layering
    > 
    > It's very important to understand that Lumen will always apply themes in the following order:
    > - Built-in styles (Lumen)
    > - Styles from your ```default``` theme
    > - Styles from the theme applied to the ```<App>``` element.
    > 
    > This means that themes are **not** applied in isolation. Instead, they build on top of built-in Lumen styles and your ```default``` theme. 


2. **Components** 

    Once you've created your themes and added your design tokens, you can start customising components. To do this, you create **variants**.
    
    Lumen has various components and has some predefined variants. For instance, Lumen defines a *primary* variant of the *button* component.

    In your configuration object, you can create your own variants and define how they should look using **component stylesets**. A component styleset is a set of properties, very similar to a CSS rule.

    For instance, to create a variant of the *panel* component called *warning*, we would first define the variant:

    ```yaml
    components:
        ...
        panel:                              #component
            warning:                        #variant
                ...
                
    ```

    After doing this, for each of our themes (*default* and *dark*), we would define two properties— the background and border of the panel.
    ```yaml
    components:
        ...
        panel:                              #component
            warning:                        #variant
                default:                    #theme-default
                    bg: "{yellow-400}"
                    border: "{yellow-300}"
                dark:                       #theme-dark
                    bg: "{yellow-300}"      #reference value
                    border: "#b3810c"       #absolute value
                
    ```

3. **Styling elements**  

    Once we've configured this, we go back to our ```<App>``` element where we applied the theme.

    ```html
    <App data-theme="default">
        ...
    </App>
    ```

    We insert a Lumen Panel element—

    ```jsx
    <App data-theme="default">
        <Panel icon={<FiDanger />}>
            This currently a default Lumen panel.
        </Panel>
    </App>
    ```

    And we can then apply the variant we defined:
    ```jsx
    <App data-theme="default">
        <Panel variant="warning" icon={<FiDanger />}>
            This is now a yellow warning panel.
        </Panel>
    </App>
    ```

## What happens behind the scenes
> 📘 Looking to get started with Lumen quickly?
> 
> Skip past this section.

Lumen makes extensive use of CSS variables. Truly— they're everywhere.

As common practice dictates, CSS variables are *mostly* defined under the ```:root``` selector. This is where your ```default``` theme lives.


```css
:root {
    /* Example of setting colours */
    --brand-primary: rgb(26, 44, 240);

    /* Examples of global spacing options */
    --padding-multiplier-top: 1;
    --padding-multiplier-right: 1.5;
    --padding-multiplier-bottom: 1;
    --padding-multiplier-left: 1.5;

    /* Examples of component variant definitions with preset values */
    --button-cta-bg: #8a0a59;
    --button-cta-borderPrimary: #730e4c;
    --button-cta-borderSecondary: #4a042f;

    /* Examples of component variant definitions with reference values */
    --panel-main-bg: var(--brand-500);
    --panel-main-border: var(--brand-600);
}
```

You may have additional themes, the variables for which will live in a selector that looks like this:

```css
:root[data-theme="{theme name}"] {
    ...
}
```

Of course, defining CSS variables and applying them throughout your project can get complicated quickly. The Lumen PostCSS plugin provides a level of abstraction to help with this.

The Lumen PostCSS plugin would first create variables for the design tokens of each theme. 

```css
:root {
    --brand-100: rgb(26, 44, 240);
    --brand-200: rgb(117, 21, 80);
    --sm: 0.8em;
    --md: 1.1em;
    --lg: 1.4em;
    /* ... */
}

:root[data-theme="dark"] {
    --brand-100: rgb(23, 40, 238);
    /* ... */
}
```
And then it iterates over each component variant, defining further variables based on the configuration:

```css
:root .lds-panel.warning {
    --bg: var(--brand-400);
    --borderColor: var(--brand-300);
}

:root[data-theme="dark"] .lds-panel.warning {
    --bg: var(--brand-300);
    --borderColor: var(--brand-200);
}
```

The core Lumen stylesheets then apply user styles:

```css
.lds-panel {
    background-color: var(--bg);
    border: var(--borderWidth, 1px) var(--borderStyle, solid) var(--borderColor);
}
```