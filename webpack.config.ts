import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const pkg = require('./package.json');
const year = new Date().getFullYear();

const copyright = `zoom.ts v${pkg.version} (${pkg.homepage})
Copyright (c) 2016-${year} ${pkg.author.name} (${pkg.author.url})
@license ${pkg.license} (https://github.com/michaelbull/zoom.ts/blob/master/LICENSE)`;

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const exampleDir = path.resolve(__dirname, 'example');

export default (env: any, args: any): webpack.Configuration => {
    let styleLoaders: webpack.Loader[] = [
        { loader: 'css-loader?sourceMap&importLoaders=1' },
        { loader: 'postcss-loader?sourceMap' },
        { loader: 'sass-loader?sourceMap' }
    ];

    let config: webpack.Configuration = {
        entry: {
            zoom: path.resolve(srcDir, 'zoom.ts'),
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
                template: path.resolve(exampleDir, 'index.ejs'),
                inject: 'head'
            })
        ],

        devServer: {
            stats: 'errors-only'
        }
    };

    switch (args.mode) {
        case 'production':
            config.plugins!.push(new ExtractTextPlugin('[name].css'));
            break;

        case 'development':
            config.devtool = 'inline-source-map';
            break;
    }

    return config;
};
