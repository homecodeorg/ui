module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss|styl)$': 'identity-obj-proxy',
    '^justorm/react$': 'justorm/dist/esm/src/plugins/react',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
