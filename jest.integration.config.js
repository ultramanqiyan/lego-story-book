module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/integration/**/*.test.js'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js']
}
