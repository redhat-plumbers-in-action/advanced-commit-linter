import { Commit } from '../../../src/commit';
import { SingleCommitMetadata } from '../../../src/schema/input';

export interface ICommitTestContext {
  'no-check-policy': Commit;
  'only-tracker-policy': Commit;
  'only-cherry-pick-policy': Commit;
  'systemd-rhel-policy': Commit;
}

export const plainCommit: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature`,
    cherryPick: [],
  },
};

export const plainCommitWithUpstreamException: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nrhel-only`,
    cherryPick: [],
  },
};

export const plainCommitWithTrackerException: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\ngithub-only`,
    cherryPick: [],
  },
};

export const tracker: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nResolves: #123`,
    cherryPick: [],
  },
};

export const TrackerWithException: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\ngithub-only\n\nResolves: #123`,
    cherryPick: [],
  },
};

export const upstream: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithException: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nrhel-only\n\n(cherry picked from commit 2222222222222222222222222222222222222222)`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamAndTracker: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\nResolves: #123`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamAndTrackerWithException: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithExceptionAndTracker: SingleCommitMetadata = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\nResolves: #123\n\nrhel-only`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithExceptionAndTrackerWithException: SingleCommitMetadata =
  {
    sha: '1111111111111111111111111111111111111111',
    url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
    message: {
      title: 'feat: add new feature',
      body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123\n\nrhel-only`,
      cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
    },
  };

export const commitsWithMissingData: SingleCommitMetadata[] = [
  plainCommit,
  upstreamAndTracker,
  upstreamAndTracker,
];

export const commitsWithTracker: SingleCommitMetadata[] = [
  plainCommitWithTrackerException,
  tracker,
  TrackerWithException,
  upstreamAndTracker,
  upstreamAndTrackerWithException,
  upstreamWithExceptionAndTracker,
  upstreamWithExceptionAndTrackerWithException,
];

export const commitsWithUpstream: SingleCommitMetadata[] = [
  plainCommitWithUpstreamException,
  upstream,
  upstreamWithException,
  upstreamAndTracker,
  upstreamAndTrackerWithException,
  upstreamWithExceptionAndTracker,
  upstreamWithExceptionAndTrackerWithException,
];

export const commitsWithUpstreamAndTracker: SingleCommitMetadata[] = [
  upstreamAndTracker,
  upstreamAndTrackerWithException,
  upstreamWithExceptionAndTracker,
  upstreamWithExceptionAndTrackerWithException,
];

// TODO: test more types of Commit Metadata ...
export const commitContextFixture: ICommitTestContext = {
  'no-check-policy': new Commit(upstreamWithExceptionAndTrackerWithException),
  'only-tracker-policy': new Commit(
    upstreamWithExceptionAndTrackerWithException
  ),
  'only-cherry-pick-policy': new Commit(
    upstreamWithExceptionAndTrackerWithException
  ),
  'systemd-rhel-policy': new Commit(
    upstreamWithExceptionAndTrackerWithException
  ),
};
