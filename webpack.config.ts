import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

let pkg = require('./package.json');
let year = new Date().getFullYear();

let copyright = `zoom.ts v${pkg.version} (${pkg.homepage})
Copyright (c) 2016-${year} ${pkg.author.name} (${pkg.author.url})
@license ${pkg.license} (https://github.com/michaelbull/zoom.ts/blob/master/LICENSE)`;

let srcDir = path.resolve(__dirname, 'src');
let distDir = path.resolve(__dirname, 'dist');
let exampleDir = path.resolve(__dirname, 'example');

function configure(env: any, args: any): webpack.Configuration {
    let styleLoaders: webpack.Loader[] = [
        'css-loader?sourceMap&importLoaders=1',
        'postcss-loader?sourceMap',
        'sass-loader?sourceMap'
    ];

    let config: webpack.Configuration = {
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
                    use: (args.mode === 'production') ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: styleLoaders
                    }) : ['style-loader', ...styleLoaders]
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
            config.plugins!.push(new ExtractTextPlugin('[name].css'));
            break;
    }

    return config;
}

export default configure;
