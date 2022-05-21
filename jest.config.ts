/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  coverageProvider: 'v8',
  displayName: 'ARABot Unit Tests',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.(t|j)sx?$': 'esbuild-jest',
  },
});
