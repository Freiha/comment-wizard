# Comment Wizard

Source code for extension published in webstore including build scripts.

## Files

- `setup.sh` contains script to build extension, execute to create files that are uploaded into webstore, it will create three folders:
  - `/chrome` (contains Chrome extension)
  - `/firefox` (contains Firefox extension)
  - `/firefox_source` (contains un-webpacked files required for upload in Firefox web store)
- `setup_firefox.sh` contains the script that is required in Firefox web store when webpacked files are uploaded; is copied into `firefox_source` (can only be executed in the `firefox_source` folder created by `setup.sh`!; it will not be executed at this point)
- `webpack.config.sh` webpacks the files created by `setup.sh` (except for the ones in `/firefox_source`)
- `webpack.config_firefox.sh` is copied into `/firefox_source` by `setup.sh` to webpack files for Firefox (this script is not executed at this step)
- `/src`
  - `/icons` contains icons displayed in browser
  - `/incomingComments` contains files required for crawling and displaying comments
  - `content.js` used for local execution, first file called by extension, injects script files according to settings set by the user in the extension popup.
  - `content_[chrome, firefox].js` first file called by extension after packing; each browser requires their own file as Firefox does not yet support messaging between content and injected scripts.
  - `inject_*.js` files containing functionality, are injected into website (`inject_[firefox_]incoming_comments.js`needs specific files for each browser as Firefox does not support messaging between content and injected scripts)
  - `manifest.json` manifest file for debugging
  - `manifest_[chrome, firefox].js` manifest files for each browser, different files are needed as Chrome requires manifest version 3, which was not yet supported by Firefox at the time of publication
  - `popup.[css, html, js]` files to display popup (when clicking on extension icon in browser)

## Debugging/Local Execution

### Chrome

1. Open Extension page in Chrome
2. Switch on "Developer mode"
3. Click "Load unpacked" and select `manifest.json`

### Firefox

Follow instructions here https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
Note: If Firefox is your main browser, you might like to create a specific profile for testing the extension.

There are no debug files for Firefox, you need to first build the extension files.

1. Run `setup.sh`
2. Open Add ons and Themes page in Firefox
3. Load extension from the `/firefox` folder created by `setup.sh`

### Please note!

Since many more files have to be loaded, sometimes during execution, a file that is required by other files is loaded too late (most occurring error message `getLanguageCode is not defined`. Keep refreshing the page until it works.

Changes in the script files are updated immediately upon page refresh, for changes in the content files, one has to refresh the extension on the extension page in the browser.

## Build Package for Webstore

Execute `setup.sh`.
The script creates one file per feature (it will merge all files from the `/incomingComments` folder and add `inject_[firefox_]incoming_comments`) for Chrome and Firefox and webpacks them using `webpack.config.js` (webpack can't be used to merge the files as there are no modules used in this project).

The script will also create an additional folder `firefox_source` and copies all files required for the Firefox extension unbundled into the folder, including Firefox build scripts `setup_firefox.sh` and `webpack.config_firefox.sh`
This is required to upload into Firefox web store as Firefox needs the source files and build scripts to validate the files and check if the bundled files uploaded match the source.

To upload in web stores, zip the files in each extension folder (Note: Chrome doesn't care which level the files are in, Firefox is picky and requires the files to be on top level, so don't zip the folder but the folder contents!)

## Contribute

Before you file a merge request, **PLEASE** run prettier on the project.
To do so:
`npm install` in the project dir and run `npm run prettier:format`
Thank you!
