const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let pkg = require('./package.json');
let year = new Date().getFullYear();

let copyright = `zoom.ts v${pkg.version} (${pkg.homepage})
Copyright (c) 2016-${year} ${pkg.author.name} (${pkg.author.url})
@license ${pkg.license} (https://github.com/michaelbull/zoom.ts/blob/master/LICENSE)`;

let srcDir = path.resolve(__dirname, 'src');
let distDir = path.resolve(__dirname, 'dist');
let exampleDir = path.resolve(__dirname, 'example');

function configure(env, args) {
    let mode = args.mode;
    let production = mode === 'production';

    let styleLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                importLoaders: 1
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true
            }
        }
    ];

    let config = {
        entry: {
            zoom: path.resolve(srcDir, 'index.ts'),
            example: path.resolve(exampleDir, 'index.js')
        },

        output: {
            path: distDir,
            library: '[name]',
            libraryTarget: 'umd',
            umdNamedDefine: true,
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.scss$/,
                    use: [
                        production ? MiniCssExtractPlugin.loader : 'style-loader',
                        ...styleLoaders
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: 'file-loader?name=assets/[name]-[hash].[ext]'
                }
            ]
        },

        resolve: {
            extensions: [
                '.js',
                '.ts'
            ]
        },

        plugins: [
            new webpack.BannerPlugin(copyright),
            new HtmlWebpackPlugin({
                inject: 'head',
                hash: true,
                template: 'example/index.ejs',
                favicon: 'assets/favicon.ico'
            })
        ],

        devServer: {
            stats: 'errors-only'
        }
    };

    switch (args.mode) {
        case 'development':
            config.devtool = 'inline-source-map';
            break;

        case 'production':
            config.plugins.push(new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].css'
            }));
            break;
    }

    return config;
}

module.exports = configure;
