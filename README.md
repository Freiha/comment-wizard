# Comment Wizard

Source code for extension published in webstore including build sripts.

DEVELOPMENT IS DISCONTINUED UNLESS SOMEONE WANTS TO TAKE OVER!


## Files
- `setup.sh` contains script to build extension, execute to create files that are uploaded into webstore, it will create three folders: 
  - `/chrome` (contains chrome extension)
  - `/firefox` (contains firefox extension)
  - `/firefox_source` (contains un-webpacked files required for upload in firefox webstore)
- `setup_firefox.sh` contains the script that is required in firefox webstore when webpacked files are uploaded; is copied into `firefox_source` (can only be executed in the `firefox_source` folder created by `setup.sh`!; it will not be executed at this point)
- `webpack.config.sh` webpacks the files created by `setup.sh` (except for the ones in `/firefox_source`)
- `webpack.config_firefox.sh` is copied into `/firefox_source` by `setup.sh` to webpack files for firefox (this script is not executed at this step)
- `/bin`
  - `/icons` contains icons displayed in browser
  - `/incomingComments` contains files required for crawling and displaying comments
  - `content.js` used for local execution, first file called by extension, injects script files according to settings set by the user in the extension popup.
  - `content_[chrome, firefox].js` first file called by extension after packing; each browser requires their own file as firefox does not yet support messaging between content and injected scripts.
  - `inject_*.js` files containing functionality, are injected into website (`inject_[firefox_]incoming_comments.js`needs specific files for each browser as firefox does not support messaging between content and injected scripts)
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
1. Open Add ons and Themes page in Firefox
2. Load extension via `manifest_firefox.json`

### Please note!
Since many more files have to be loaded, sometimes during execution, a file that is required by other files is loaded too late (most occurring error message `getLanguageCode is not defined`. Keep refreshing the page until it works.

Changes in the script files are updated immediately upon page refresh, for changes in the content files, one has to refresh the extension on the extension page in the browser.


## Build Package for Webstore
Execute `setup.sh`. 
The script creates one file per feature (it will merge all files from the `/incomingComments` folder and add `inject_[firefox_]incoming_comments`) for chrome and firefox and webpacks them using `webpack.config.js` (webpack can't be used to merge the files as there are no modules used in this project).

The script will also create an additional folder `firefox_source` and copies all files required for the firefox extension unbundled into the folder, including firefox build scripts `setup_firefox.sh` and `webpack.config_firefox.sh`
This is required to upload into firefox webstore as firefox needs the source files and build scripts to validate the files and check if the bundled files uploaded match the source.

To upload in webstores, zip the files in each extension folder (Note, Chrome doesn't care which level the files are in, Firefox is picky and requires the files to be on top level, so don't zip the folder but the folder contents!)