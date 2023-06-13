import { describe, it, expect, beforeEach, test } from 'vitest';

import {
  ITrackerValidatorTestContext,
  trackerValidatorContextFixture,
} from '../fixtures/validation/tracker-validator.fixture';
import { TrackerValidator } from '../../../src/validation/tracker-validator';

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
            "type": "bugzilla",
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
            "type": "bugzilla",
            "url": "https://bugzilla.redhat.com/show_bug.cgi?id=789",
          },
          "exception": "github-only",
        }
      `);
    });

    test('cleanArray()', context => {
      expect(
        TrackerValidator.cleanArray({
          message: 'message',
          status: 'success',
          data: [
            {
              data: {
                keyword: 'keyword',
                type: 'unknown',
                id: '123',
              },
            },
            {
              data: {
                keyword: 'keyword',
                type: 'unknown',
                id: '123',
              },
            },
            {
              data: {
                keyword: 'keyword',
                type: 'unknown',
                id: '456',
              },
            },
            {
              data: {
                keyword: 'keyword',
                type: 'unknown',
                id: '456',
              },
              exception: 'exception',
            },
            {
              exception: 'exception',
            },
            {},
            {},
          ],
        })
      ).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "data": {
                "id": "123",
                "keyword": "keyword",
                "type": "unknown",
              },
            },
            {
              "data": {
                "id": "123",
                "keyword": "keyword",
                "type": "unknown",
              },
            },
            {
              "data": {
                "id": "456",
                "keyword": "keyword",
                "type": "unknown",
              },
            },
            {
              "data": {
                "id": "456",
                "keyword": "keyword",
                "type": "unknown",
              },
              "exception": "exception",
            },
            {
              "exception": "exception",
            },
          ],
          "message": "message",
          "status": "success",
        }
      `);
    });

    test('getMessage()', context => {
      expect(
        TrackerValidator.getMessage([], 'failure', false)
      ).toMatchInlineSnapshot('"**Missing issue tracker** ✋"');

      expect(
        TrackerValidator.getMessage(
          [
            {
              exception: 'github-only',
              data: {
                id: '123',
                keyword: 'Resolves: #',
                type: 'bugzilla',
                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
              },
            },
          ],
          'success',
          false
        )
      ).toMatchInlineSnapshot(
        '"[123](https://bugzilla.redhat.com/show_bug.cgi?id=123)"'
      );

      expect(
        TrackerValidator.getMessage(
          [
            {
              exception: 'github-only',
              data: {
                id: '123',
                keyword: 'Resolves: #',
                type: 'bugzilla',
                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123',
              },
            },
            {
              exception: 'github-only',
              data: {
                id: '456',
                keyword: 'Related: #',
                type: 'bugzilla',
                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=456',
              },
            },
            {
              exception: 'github-only',
            },
          ],
          'success',
          false
        )
      ).toMatchInlineSnapshot(
        '"[123](https://bugzilla.redhat.com/show_bug.cgi?id=123), [456](https://bugzilla.redhat.com/show_bug.cgi?id=456), github-only"'
      );

      expect(
        TrackerValidator.getMessage(
          [
            {
              exception: 'github-only',
            },
          ],
          'success',
          false
        )
      ).toMatchInlineSnapshot('"github-only"');

      expect(
        TrackerValidator.getMessage([], 'failure', true)
      ).toMatchInlineSnapshot('"_no tracker_"');
    });
  });
});
