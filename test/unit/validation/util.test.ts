import { describe, expect, test } from 'vitest';

import { isException } from '../../../src/validation/util';

import {
  ConfigException,
  configExceptionSchema,
} from '../../../src/schema/config';

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
});
