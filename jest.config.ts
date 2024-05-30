import { getJestProjects } from '@nx/jest';

export default {
  projects: getJestProjects(),
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageReporters: ['html'],
};
