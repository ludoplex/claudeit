module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        'app.js',
        '!node_modules/**'
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 65,
            lines: 60,
            statements: 60
        }
    },
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
