const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BannerPlugin } = require('webpack');

let pkg = require('./package.json');
let year = new Date().getFullYear();

let copyright = `zoom.ts v${pkg.version} (${pkg.homepage})
Copyright (c) 2016-${year} ${pkg.author.name} (${pkg.author.url})
@license ${pkg.license} (https://github.com/michaelbull/zoom.ts/blob/master/LICENSE)`;

let srcDir = path.resolve(__dirname, 'src');
let distDir = path.resolve(__dirname, 'dist');

module.exports = (env = {}, args = {}) => {
    let styleRules = [
        { loader: 'css-loader?sourceMap&importLoaders=1' },
        { loader: 'postcss-loader?sourceMap' },
        { loader: 'sass-loader?sourceMap' }
    ];

    let config = {
        entry: {
            zoom: path.resolve(srcDir, 'zoom.ts')
        },

        output: {
            path: distDir,
            library: 'zoom',
            libraryTarget: 'umd',
            umdNamedDefine: true,
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            sourceMap: args.mode === 'development'
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: (args.mode === 'production') ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: styleRules
                    }) : ['style-loader', ...styleRules]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|pdf)$/,
                    use: 'file-loader?name=assets/[name]-[hash].[ext]'
                }
            ]
        },

        resolve: {
            extensions: [
                '.js',
                '.ts'
            ],
            modules: [
                'node_modules',
                srcDir
            ]
        },

        plugins: [
            new BannerPlugin(copyright),
            new HtmlWebpackPlugin({
                template: 'index.ejs',
                inject: 'head'
            })
        ],

        devServer: {
            stats: 'errors-only'
        }
    };

    if (args.mode === 'production') {
        config.plugins.push(new ExtractTextPlugin('[name].css'))
    } else {
        config.devtool = 'source-map';
    }

    return config;
};
