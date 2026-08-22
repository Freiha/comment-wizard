const path = require("path");

const config = {
  module: {},
};

const firefoxConfig = Object.assign({}, config, {
  entry: {
    iic: "./temp/incomingComments_firefox.js",
    idb: "./src/inject_delete_button.js",
    irr: "./src/inject_remove_rating.js",
    irs: "./src/inject_round_subs.js",
    irh: "./src/inject_reorder_header.js",
    ild: "./src/inject_update_loginDropdown.js",
    content: "./src/content_firefox.js",
    popup: "./src/popup.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "firefox"),
    filename: "[name].js",
  },
});

const chromeConfig = Object.assign({}, config, {
  entry: {
    iic: "./temp/incomingComments.js",
    idb: "./src/inject_delete_button.js",
    irr: "./src/inject_remove_rating.js",
    irs: "./src/inject_round_subs.js",
    irh: "./src/inject_reorder_header.js",
    ild: "./src/inject_update_loginDropdown.js",
    content: "./src/content_chrome.js",
    popup: "./src/popup.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "chrome"),
    filename: "[name].js",
  },
});

module.exports = [firefoxConfig, chromeConfig];

// npx webpack --config webpack.config.js
