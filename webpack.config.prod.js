/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const base = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = merge(base, {
    output: {
        path: path.resolve(__dirname, 'dist/public/js/'),
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.min.js',
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/template.html'),
            filename: path.join(__dirname, 'dist/public/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'public'),
                    to: path.join(__dirname, 'dist/public'),
                    toType: 'dir',
                    globOptions: {
                        ignore: [
                            '**/index.html',
                            '**/template.html',
                        ],
                    },
                },
            ],
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'all',
                },
            },
        },
    },
});
