const process = require('process');

module.exports = {
    rootDir: process.cwd(),
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    reporters: [
        'default'
    ],
    collectCoverageFrom: [
        '<rootDir>/src/**',
        '!<rootDir>/src/**/index.ts'
    ],
    coverageReporters: ['lcov', 'html'],
    coverageDirectory: '<rootDir>/reports/coverage'
};
