import cssnano from 'cssnano';
import postcss from 'postcss';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

let copyright = [
    'zoom.ts v' + require('./package.json').version,
    'https://github.com/michaelbull/zoom.ts',
    '',
    'Copyright (c) 2018 Michael Bull (https://www.michael-bull.com)',
    '@license ISC'
];

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
    input: 'src/index.ts',
    output: {
        file: 'dist/zoom.js',
        format: 'umd',
        name: 'zoom',
        banner: '/*!' + '\n' + ' * ' + copyright.join('\n * ') + '\n' + ' */' + '\n'
    },
    plugins: [
        typescript({
            check: prodEnv,
            clean: true,
            abortOnError: false,
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false
                }
            }
        }),
        sass({
            output: 'dist/zoom.css',
            processor: css => postcss(postcssPlugins)
                .process(css)
                .then(result => result.css)
        })
    ]
};

if (prodEnv) {
    configuration.plugins.push(uglify());
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
