var path = require('path'),
    webpack = require('webpack');

var banner = [
    'zoom.ts v' + require('./package.json').version,
    'https://www.michael-bull.com/projects/zoom.ts',
    '',
    'Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)',
    '@license ISC'
];

module.exports = {
    entry: {
        zoom: './src/index.ts'
    },

    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: '[name].js'
    },

    resolve: {
        extensions: [
            '.webpack.js',
            '.web.js',
            '.js',
            '.jsx',
            '.ts',
            '.tsx'
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader'
            },
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                output: {
                    path: './'
                },
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                    fileOutput: {
                        dir: 'reports/tslint',
                        clean: true
                    }
                },
                postcss: [
                    require('cssnano')({
                        autoprefixer: {
                            add: true,
                            remove: false
                        }
                    })
                ]
            }
        }),
        new webpack.BannerPlugin({
            banner: banner.join('\n'),
            entryOnly: true
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
} else {
    module.exports.devtool = '#source-map';
}
