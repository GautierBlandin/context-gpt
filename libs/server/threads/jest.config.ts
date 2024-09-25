/* eslint-disable */
export default {
  displayName: 'server-threads',
  preset: '../../../jest.preset.cjs',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/server/threads',
};
