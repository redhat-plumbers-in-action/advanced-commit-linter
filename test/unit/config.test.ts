import { describe, it, expect, beforeEach } from 'vitest';

import { Config } from '../../src/config';

import {
  configContextFixture,
  IConfigTestContext,
} from './fixtures/config.fixture';

describe('Config Object', () => {
  beforeEach<IConfigTestContext>(context => {
    context.configs = configContextFixture.configs;
  });

  it<IConfigTestContext>('can be instantiated', context =>
    context.configs.map(configItem => expect(configItem).toBeDefined()));

  it<IConfigTestContext>('isConfigEmpty()', context => {
    expect(Config.isConfigEmpty(null)).toBe(true);
    expect(Config.isConfigEmpty(undefined)).toBe(true);
    expect(Config.isConfigEmpty({})).toBe(false);
  });
});
