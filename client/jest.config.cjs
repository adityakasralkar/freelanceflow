/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/src/__tests__/__mocks__/fileMock.cjs',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.ts'],
};
