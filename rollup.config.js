import cssnano from 'cssnano';
import postcss from 'postcss';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import closure from 'rollup-plugin-closure-compiler-js';

let copyright = [
    'zoom.ts v' + require('./package.json').version,
    'https://www.michael-bull.com/projects/zoom.ts',
    '',
    'Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)',
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
let devEnv = (process.env.NODE_ENV === 'development');

let configuration = {
    moduleName: 'zoom',
    entry: 'index.ts',
    dest: 'dist/zoom.js',
    format: 'iife',
    sourceMap: !prodEnv,
    banner: '/*!' + '\n' + ' * ' + copyright.join('\n * ') + '\n' + ' */' + '\n',
    plugins: [
        typescript({
            check: prodEnv,
            clean: true,
            abortOnError: false
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
    configuration.plugins.push(
        closure({
            languageOut: 'ECMASCRIPT5_STRICT',
            compilationLevel: 'ADVANCED',
            warningLevel: 'QUIET'
        })
    );
} else if (devEnv) {
    configuration.plugins.push(serve({ port: 8080 }), livereload());
}

export default configuration;
