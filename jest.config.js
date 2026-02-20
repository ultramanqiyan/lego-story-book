module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js'
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        'functions/**/*.js',
        '!**/node_modules/**',
        '!**/tests/**'
    ],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 75,
            functions: 80,
            lines: 80
        }
    },
    transform: {
        '^.+\\.(js|jsx)$': ['next/swc-jest', {}]
    }
}
