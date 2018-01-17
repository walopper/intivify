const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/');
const APP_DIR = path.resolve(__dirname, 'src/');

module.exports = {
    context: APP_DIR,
    entry: './app.jsx',
    module: {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                exclude: /node_modules/,
                loader : 'babel-loader'
            }
        ]
    },
    devServer: {
        contentBase: BUILD_DIR,
        compress: true,
        stats: "errors-only",
        open: false,
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/
        }
    },
    output: {
        path: BUILD_DIR,
        filename: "js/bundle.js"
    }
};