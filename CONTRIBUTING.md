# Contributing

### Contents:
1. [Developing an Addon](#developing-an-addon)

   a. [Chrome.Storage API](#chromestorage-api)
   
   b. [Background Scripts/Service Workers](#background-scriptsservice-workers)
4. [Contributing an Addon](#contributing-an-addon)

## Developing an Addon
To contribute an addon to wasteof.plus, you must create a folder for the addon under the `addons/` directory. This subfolder must be named using a descriptive addon id that describes the addon's "main purpose" well. 

> Addons should not be too broad, it is better to create several addons than one big addon (users will have the option to turn on/off the different smaller addons, creating more customizability)


The addon folder should have the following files:
- `addon.js` - This contains your main addon code, typically with a main `addon()` function.
- `addon.json` - The addon.json object contains the following properties:
  - urls - Array[String]: An array of the exact URLs on which your addon scripts/styles should be applied to
  - urlcontains - Array[String]: An array of URL snippets. Pages with URLs containing any of these snippets will have your addon applied to them.
  - name - String: A short name (3-4 words) for your addon. Ex: Profile Hover Cards (is not the same as your addon id)
  - description - String: a concise description of what your addon does that will be shown in the extension popup
  - developers - Array[{name, link}]: a list of objects containing the display names and links to the developer(s) of the addon. Each item should be an object with the properties `link` and `name`.
  - enabledByDefault - Boolean: whether the addon should be enabled by default. If set to false, the addon will have to be enabled by the user. Addons that provide basic or core functionalities should have this property set to true.
  - hasContentScript - Boolean: whether a content script `addon.js` file is present in the addon
  - hasContentStyle - Boolean: whether an `addon.css` file is present/should be used on the pages defined in `url` and `urlcontains`
- `addon.css`- - This is required. If your addon doesn't contain any CSS, it can be blank.

If you have utility files or other code files, create a `lib/` folder under your addon's folder. If you have 

## Permissions:

### Chrome.Storage API
Addons should primarily use the `chrome.storage.local` API for storing simple data, such as the online/offline status of a user. However, for data that may be more permanant or that should be synced across multiple of a user's browser istances, such as unread comments/posts, the `chrome.storage.sync` API should be used instead.

### Background Scripts/Service Workers
Addons should primarily avoid requiring service worker activity/interaction, but if necessary, the background script may be communicated with using the `chrome.runtime.sendMessage` function. In the future, a better framework will be developed to handle messages sent to the background script from content scripts.

## Contributing an Addon
Create a Pull Request with information about your addon, why it's helpful, how it works, etc. I will review the PR and give feedback. If it is accepted (which it will be in the vast majority of circumstances), the PR will be merged into the main branch.
