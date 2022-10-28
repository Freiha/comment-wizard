const path = require("path");

const config = {
  module: {},
};

const firefoxConfig = Object.assign({}, config, {
  entry: {
    iic: "./bin/incomingComments.js",
    idb: "./bin/deleteButton.js",
    ihf: "./bin/helperFunctions.js",
    irr: "./bin/removeRating.js",
    irs: "./bin/roundSubs.js",
    irh: "./bin/reorderHeader.js",
    ild: "./bin/loginDropdown.js",
    content: "./bin/content.js",
    popup: "./bin/popup.js",
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "firefox"),
    filename: "[name].js",
  },
});

module.exports = [firefoxConfig];
