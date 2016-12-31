var webpack = require('webpack'),
    SassLintPlugin = require('sasslint-webpack-plugin'),
    TypedocWebpackPlugin = require('typedoc-webpack-plugin'),
    FailPlugin = require('webpack-fail-plugin');

var banner = [
    'zoom.ts v' + require('./package.json').version,
    'https://michael-bull.com/projects/zoom.ts',
    '',
    'Copyright (c) 2016 Michael Bull (https://www.michael-bull.com)',
    'Copyright (c) 2013 @fat',
    '@license MIT'
];

module.exports = {
    entry: {
        zoom: './lib/Listener.ts',
    },

    output: {
        path: './dist',
        publicPath: 'dist/',
        filename: '[name].js',
        library: 'zoom',
        libraryTarget: 'var'
    },

    resolve: {
        extensions: [
            '',
            '.webpack.js',
            '.web.js',
            '.js',
            '.jsx',
            '.ts',
            '.tsx'
        ]
    },

    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint'
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
        ]
    },

    plugins: [
        new SassLintPlugin({
            configFile: '.sass-lint.yml',
            glob: 'src/**/*.s?(a|c)ss',
            failOnWarning: true,
            failOnError: true
        }),
        new TypedocWebpackPlugin({
            name: 'zoom.ts',
            mode: 'file',
            includeDeclarations: false,
            ignoreCompilerErrors: false,
            readme: 'none'
        }),
        new webpack.BannerPlugin(banner.join('\n'), {
            entryOnly: true
        })
    ],

    tslint: {
        emitErrors: true,
        failOnHint: true
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        FailPlugin
    );
} else {
    module.exports.devtool = 'source-map';
}
