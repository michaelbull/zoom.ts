import typescript from 'rollup-plugin-typescript';
const version = require('./package.json').version;

const copyright = [
    'zoom.ts v' + version,
    'https://michael-bull.com/projects/zoom.ts',
    '',
    'Copyright (c) 2016 Michael Bull (https://michael-bull.com)',
    'Copyright (c) 2013 @fat',
    '@license MIT'
];

export default {
    moduleName: 'zoom',
    entry: 'lib/index.ts',
    dest: 'dist/zoom.js',
    format: 'umd',
    banner: '/*!' + '\n' + ' * ' + copyright.join('\n * ') + '\n' + ' */' + '\n',
    plugins: [
        typescript()
    ]
}
