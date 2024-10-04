module.exports = {
  transform: {
    '^.+\.tsx?$': 'ts-jest',
    '^.+\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
'/node_modules/(?!justorm).+\.js$'
  ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss|styl)$': 'identity-obj-proxy',
    '^justorm/react$': 'justorm/dist/esm/src/plugins/react',
    '^uilib(.*)$': '<rootDir>/src$1',
    '\\.svg$': '<rootDir>/tests/mocks/svgMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/bin/test.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
