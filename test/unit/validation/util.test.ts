import { describe, expect, test } from 'vitest';

import { isException } from '../../../src/validation/util';

import { ConfigException } from '../../../src/schema/config';

describe('Validation Utilities', () => {
  test('isException', () => {
    let exceptionPolicy: ConfigException | undefined = {
      label: ['test exception note'],
      note: ['test-exception', 'test exception', 'Test-Exception'],
    };

    let commitBody = 'This is a commit message\n\ntest exception note';

    expect(isException(exceptionPolicy, commitBody)).toMatchInlineSnapshot(
      `undefined`
    );

    commitBody = 'This is a commit message\n\ntest-exception';

    expect(isException(exceptionPolicy, commitBody)).toMatchInlineSnapshot(
      `"test-exception"`
    );

    commitBody = 'This is a commit message\n\ntest-exception\n\nTest-Exception';

    expect(isException(exceptionPolicy, commitBody)).toMatchInlineSnapshot(
      `"test-exception"`
    );

    exceptionPolicy = undefined;
    expect(isException(exceptionPolicy, commitBody)).toMatchInlineSnapshot(
      `undefined`
    );
  });

  test('isException with empty note array', () => {
    const policy: ConfigException = { note: [] };
    expect(isException(policy, 'some body')).toBeUndefined();
  });

  test('isException with no note property', () => {
    const policy: ConfigException = { label: ['some-label'] };
    expect(isException(policy, 'some body')).toBeUndefined();
  });

  test('isException with empty commit body', () => {
    const policy: ConfigException = { note: ['exception-note'] };
    expect(isException(policy, '')).toBeUndefined();
  });

  test('isException returns matched text, not the regex pattern', () => {
    const policy: ConfigException = {
      note: ['rhel-only: (feature|bugfix|policy|doc|workaround|ci|test|other)'],
    };
    const commitBody = 'commit message\n\nrhel-only: ci';
    expect(isException(policy, commitBody)).toEqual('rhel-only: ci');
  });
});
