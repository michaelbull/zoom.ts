import cssnano from 'cssnano';
import postcss from 'postcss';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

let pkg = require('./package.json');
let year = new Date().getFullYear();

let copyright = `
/*!
 * zoom.ts v${pkg.version} (${pkg.homepage})
 * Copyright (c) 2016-${year} ${pkg.author.name} (${pkg.author.url})
 * @license ${pkg.license} (https://github.com/michaelbull/zoom.ts/blob/master/LICENSE)
 */
`;

let postcssPlugins = [
    cssnano({
        autoprefixer: {
            add: true,
            remove: false
        }
    })
];

let prodEnv = (process.env.NODE_ENV === 'production');

let configuration = {
    input: 'index.ts',
    output: {
        file: 'dist/zoom.min.js',
        format: 'umd',
        name: 'zoom',
        banner: copyright
    },
    plugins: [
        typescript({
            check: prodEnv,
            clean: true,
            abortOnError: false,
            tsconfigOverride: {
                compilerOptions: {
                    sourceMap: true,
                    declaration: false
                },
                include: [
                    'src',
                    'index.ts'
                ]
            }
        }),
        sass({
            output: 'dist/zoom.min.css',
            processor: css => postcss(postcssPlugins)
                .process(css)
                .then(result => result.css)
        })
    ]
};

if (prodEnv) {
    configuration.plugins.push(uglify({
        output: {
            comments: (node, comment) => {
                if (comment.type === 'comment2') { // multiline comment
                    return /@preserve|@license|@cc_on/i.test(comment.value);
                } else {
                    return false;
                }
            }
        }
    }));
} else {
    configuration.output.sourcemap = true;

    configuration.plugins.push(
        serve({
            port: 8080,
            contentBase: ''
        }),
        livereload()
    );
}

export default configuration;
