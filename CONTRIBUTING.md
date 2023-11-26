# Contributing

### Contents:

1. [Forking the repository](#forking-the-repository)
2. [Developing an Addon](#developing-an-addon)

   a. [Chrome.Storage API](#chromestorage-api)

   b. [Background Scripts/Service Workers](#background-scriptsservice-workers)

3. [Contributing an Addon](#contributing-an-addon)
4. [Package.json Scripts](#packagejson-scripts)

## Forking the repository

To develop or build wasteof.plus locally on your device, you should first create a fork on GitHub.
![image](https://github.com/wasteofplus/wasteof.plus/assets/138229538/8f48ebdd-6f20-4639-85c1-7d0a2845e027)

Once you fork is created, run `git clone https://github.com/YOUR_USER_NAME/YOUR_FORK_NAME.git` to clone it into a local folder.

To install the required dependencies for wasteof.plus, you must run `npm ci` in the newly-cloned folder. ✨ There you have it! Now, you can follow the tutorials below to create a new addon or make any other modififcations to wasteof.plus!

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

## Package.JSON Scripts

- `build:chrome`
  - This is used to copy the contents of the `manifest_chromium.json` file to `manifest.json` for testing in Chrome. Without running this, wasteof.plus will not work in Chromium based browsers (Opera, Edge, Chrome, etc.)
- `build:firefox`
  - This is used to copy the contents of the `manifest_firefox.json` file to `manifest.json` for testing in Firefox. Without running this, wasteof.plus will not work in Firefox.
- `cleanup`
  - DO NOT RUN THIS IN YOUR LOCAL ENVIRONMENT. This script is only used to remove all console logs during builds.

## Contributing an Addon
Create a Pull Request with information about your addon, why it's helpful, how it works, etc. I will review the PR and give feedback. If it is accepted (which it will be in the vast majority of circumstances), the PR will be merged into the main branch.
