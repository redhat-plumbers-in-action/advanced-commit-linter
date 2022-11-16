import { Commit } from '../../../src/commit';
import { SingleCommitMetadataT } from '../../../src/schema/input';

export interface ICommitTestContext {
  'no-check-policy': Commit;
  'only-tracker-policy': Commit;
  'only-cherry-pick-policy': Commit;
  'systemd-rhel-policy': Commit;
}

export const plainCommit: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature`,
    cherryPick: [],
  },
};

export const plainCommitWithUpstreamException: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nrhel-only`,
    cherryPick: [],
  },
};

export const plainCommitWithTrackerException: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\ngithub-only`,
    cherryPick: [],
  },
};

export const tracker: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nResolves: #123`,
    cherryPick: [],
  },
};

export const TrackerWithException: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\ngithub-only\n\nResolves: #123`,
    cherryPick: [],
  },
};

export const upstream: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithException: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\nrhel-only\n\n(cherry picked from commit 2222222222222222222222222222222222222222)`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamAndTracker: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\nResolves: #123`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamAndTrackerWithException: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithExceptionAndTracker: SingleCommitMetadataT = {
  sha: '1111111111111111111111111111111111111111',
  url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
  message: {
    title: 'feat: add new feature',
    body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\nResolves: #123\n\nrhel-only`,
    cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
  },
};

export const upstreamWithExceptionAndTrackerWithException: SingleCommitMetadataT =
  {
    sha: '1111111111111111111111111111111111111111',
    url: 'https://github.com/org/repo/commit/1111111111111111111111111111111111111111',
    message: {
      title: 'feat: add new feature',
      body: `feat: add new feature\n\n(cherry picked from commit 2222222222222222222222222222222222222222)\n\ngithub-only\n\nResolves: #123\n\nrhel-only`,
      cherryPick: [{ sha: '2222222222222222222222222222222222222222' }],
    },
  };

export const commitsWithMissingData: SingleCommitMetadataT[] = [
  plainCommit,
  upstreamAndTracker,
  upstreamAndTracker,
];

export const commitsWithTracker: SingleCommitMetadataT[] = [
  plainCommitWithTrackerException,
  tracker,
  TrackerWithException,
  upstreamAndTracker,
  upstreamAndTrackerWithException,
  upstreamWithExceptionAndTracker,
  upstreamWithExceptionAndTrackerWithException,
];

export const commitsWithUpstream: SingleCommitMetadataT[] = [
  plainCommitWithUpstreamException,
  upstream,
  upstreamWithException,
  upstreamAndTracker,
  upstreamAndTrackerWithException,
  upstreamWithExceptionAndTracker,
  upstreamWithExceptionAndTrackerWithException,
];

export const commitsWithUpstreamAndTracker: SingleCommitMetadataT[] = [
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
