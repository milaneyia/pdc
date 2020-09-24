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
            '/': 'http://localhost:3001',
        },
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
});
