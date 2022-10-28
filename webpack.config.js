const path = require('path');

const config = {
    module: {},
};

const firefoxConfig = Object.assign({}, config, {
    entry: {
        iic: './temp/incomingComments_firefox.js',
        idb: './bin/inject_delete_button.js',
        irr: './bin/inject_remove_rating.js',
        irs: './bin/inject_round_subs.js',
        irh: './bin/inject_reorder_header.js',
        ild: './bin/inject_update_loginDropdown.js',
        content: './bin/content_firefox.js',
        popup: './bin/popup.js'
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'firefox'),
        filename: '[name].js',
    },
});


const chromeConfig = Object.assign({}, config, {
    entry: {
        iic: './temp/incomingComments.js',
        idb: './bin/inject_delete_button.js',
        irr: './bin/inject_remove_rating.js',
        irs: './bin/inject_round_subs.js',
        irh: './bin/inject_reorder_header.js',
        ild: './bin/inject_update_loginDropdown.js',
        content: './bin/content_chrome.js',
        popup: './bin/popup.js'
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'chrome'),
        filename: '[name].js',
    },
});


module.exports = [
    firefoxConfig, chromeConfig,
]

// npx webpack --config webpack.config.js