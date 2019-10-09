module.exports = {
    testURL: "http://localhost/",
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: false,
    coverageDirectory: './test-output',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/database/',
      '/logs/',
      '/migrations/'
    ]
};
