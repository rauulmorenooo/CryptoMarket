const path = require('path');

module.exports = {
    configureWebpack: {
        devServer: {
            headers: { 'Access-Control-Allow-Origin': '*' },
            disableHostCheck: true,
        },
        resolve: {
            alias: {
                vue$: path.resolve('./node_modules/vue/dist/vue.runtime.esm.js'),
            },
        },
    },
};