import { describe, it, expect, beforeEach, test } from 'vitest';

import {
  ITrackerValidatorTestContext,
  trackerValidatorContextFixture,
} from '../fixtures/validation/tracker-validator.fixture';

describe('Tracker Validator Object', () => {
  beforeEach<ITrackerValidatorTestContext>(context => {
    context['systemd-rhel-policy'] =
      trackerValidatorContextFixture['systemd-rhel-policy'];
  });

  it<ITrackerValidatorTestContext>('can be instantiated', context => {
    expect(context['systemd-rhel-policy']).toBeDefined();
  });

  describe('can validate tracker in commit message', () => {
    test<ITrackerValidatorTestContext>('no tracker', context => {
      expect(
        context['systemd-rhel-policy'].validate({
          sha: '123',
          url: 'https://github.com/org/repo/commit/123',
          message: {
            title: 'commit title',
            body: 'commit title',
            cherryPick: [],
          },
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "id": "",
            "keyword": "",
          },
          "exception": undefined,
        }
      `);
    });

    test<ITrackerValidatorTestContext>('valid tracker', context => {
      expect(
        context['systemd-rhel-policy'].validate({
          sha: '123',
          url: 'https://github.com/org/repo/commit/123',
          message: {
            title: 'commit title',
            body: 'commit title\n\nResolves: #789',
            cherryPick: [],
          },
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "id": "789",
            "keyword": "Resolves: #",
            "url": "https://bugzilla.redhat.com/show_bug.cgi?id=789",
          },
          "exception": undefined,
        }
      `);
    });

    test<ITrackerValidatorTestContext>('valid exception', context => {
      expect(
        context['systemd-rhel-policy'].validate({
          sha: '123',
          url: 'https://github.com/org/repo/commit/123',
          message: {
            title: 'commit title',
            body: 'commit title\n\ngithub-only',
            cherryPick: [],
          },
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "id": "",
            "keyword": "",
          },
          "exception": "github-only",
        }
      `);
    });

    test<ITrackerValidatorTestContext>('valid tracker and exception', context => {
      expect(
        context['systemd-rhel-policy'].validate({
          sha: '123',
          url: 'https://github.com/org/repo/commit/123',
          message: {
            title: 'commit title',
            body: 'commit title\n\ngithub-only\n\nResolves: #789',
            cherryPick: [],
          },
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "id": "789",
            "keyword": "Resolves: #",
            "url": "https://bugzilla.redhat.com/show_bug.cgi?id=789",
          },
          "exception": "github-only",
        }
      `);
    });
  });
});
