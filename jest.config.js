module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
  ],
};
