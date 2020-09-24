/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('./webpack.config.base');
const { merge } = require('webpack-merge');

module.exports = merge(base, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'minimal',
        proxy: {
            '/': 'http://localhost:3000',
        },
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
});
