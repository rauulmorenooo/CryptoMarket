const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './app/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }, 
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};