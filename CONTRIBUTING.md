# Contributing

## Developing an Addon
To contribute an addon to wasteof.plus, you must create a folder for the addon under the `addons/` directory. This subfolder must be named using a descriptive addon id that describes the addon's "main purpose" well. 

> Addons should not be too broad, it is better to create several addons than one big addon (users will have the option to turn on/off the different smaller addons, creating more customizability)

The addon folder should have the following files:
- `addon.js` - This contains your main addon code, typically with a main `addon()` function.
- `addon.json` - The addon.json object requires the following properties:
  - urls - An array of the exact URLs on which your addon scripts/styles should be applied to
  - urlcontains - An array of URL snippets. Pages with URLs containing any of these snippets will have your addon applied to them.
  - name - A general name (3-4 words) for your addon. Ex: Profile Hover Cards (is not the same as your addon id)
- `addon.css`- - This is required. If your addon doesn't contain any CSS, it can be blank.

If you have utility files or other code files, create a `lib/` folder under your addon's folder. If you have 

## Contributing an Addon
Create a Pull Request with information about your addon, why it's helpful, how it works, etc. I will review the PR and give feedback. If it is accepted (which it will be in the vast majority of circumstances), the PR will be merged into the main branch.
