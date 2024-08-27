const path = require("path");

const config = {
  module: {},
};

const firefoxConfig = Object.assign({}, config, {
  entry: {
    iic: "./src/incomingComments.js",
    idb: "./src/deleteButton.js",
    ihf: "./src/helperFunctions.js",
    irr: "./src/removeRating.js",
    irs: "./src/roundSubs.js",
    irh: "./src/reorderHeader.js",
    ild: "./src/loginDropdown.js",
    content: "./src/content.js",
    popup: "./src/popup.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "firefox"),
    filename: "[name].js",
  },
});

module.exports = [firefoxConfig];
