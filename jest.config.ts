module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {}],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.ts'],
};
