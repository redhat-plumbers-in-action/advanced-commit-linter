import { getInput, setOutput } from '@actions/core';
import { events } from './events';
import { Config } from './config';
import { Validator } from './validation/validator';
import { pullRequestMetadataSchema, } from './schema/input';
import { Commit } from './commit';
import { PullRequest } from './pull-request';
const action = (probot) => {
    probot.on(events.workflow_run, async (context) => {
        const config = await Config.getConfig(context);
        const prMetadataUnsafe = JSON.parse(getInput('pr-metadata', {
            required: true,
        }));
        const prMetadata = pullRequestMetadataSchema.parse(prMetadataUnsafe);
        await context.octokit.repos.createCommitStatus(context.repo({
            state: 'pending',
            sha: prMetadata.commits[prMetadata.commits.length - 1].sha,
            description: 'validation',
            context: `Advanced Commit Linter`,
        }));
        const validator = new Validator(config, context);
        const validatedCommits = await Promise.all(prMetadata.commits.map(async (singleCommit) => new Commit(singleCommit).validate(validator)));
        const validationResults = validator.validateAll(validatedCommits);
        const validated = Object.assign(Object.assign({}, prMetadataUnsafe), { validation: validationResults, commits: validatedCommits.map(commit => commit.validated) });
        const pr = await PullRequest.getPullRequest(prMetadata.number, context);
        pr.publishComment(validated.validation.message, context);
        setOutput('validated-pr-metadata', JSON.stringify(validated, null, 2));
        await context.octokit.repos.createCommitStatus(context.repo({
            state: validated.validation.status,
            sha: prMetadata.commits[prMetadata.commits.length - 1].sha,
            context: `Advanced Commit Linter`,
        }));
    });
};
const validated = {
    number: 14,
    labels: [],
    milestone: {},
    commits: [
        {
            sha: '2087c1213111cc054c894530794a6bc1ea58179d',
            url: 'https://github.com/actions-private-playground/systemd-rhel9/commit/2087c1213111cc054c894530794a6bc1ea58179d',
            message: {
                title: 'virt: Further improve detection of EC2 metal instances',
                body: 'virt: Further improve detection of EC2 metal instances\n\nCommit f90eea7\nvirt: Improve detection of EC2 metal instances\n\nAdded support for detecting EC2 metal instances via the product\nname in DMI by testing for the ".metal" suffix.\n\nUnfortunately this doesn\'t cover all cases, as there are going to be\ninstance types where ".metal" is not a suffix (ie, .metal-16xl,\n.metal-32xl, ...)\n\nThis modifies the logic to also allow those new forms.\n\nSigned-off-by: Benjamin Herrenschmidt benh@amazon.com\n(cherry picked from commit aab896e2135362ab126830c73284d4af0baad88a)\n\nRelated: #123456789',
                cherryPick: [
                    {
                        sha: 'aab896e2135362ab126830c73284d4af0baad88a',
                    },
                ],
            },
            validation: {
                status: 'success',
                message: 'https://github.com/actions-private-playground/systemd-rhel9/commit/2087c1213111cc054c894530794a6bc1ea58179d - virt: Further improve detection of EC2 metal instances - https://github.com/systemd/systemd/commit/aab896e2135362ab126830c73284d4af0baad88a https://github.com/systemd/systemd-stable/commit/aab896e2135362ab126830c73284d4af0baad88a',
                tracker: {
                    status: 'success',
                    message: '123456789',
                    data: [
                        {
                            data: {
                                keyword: 'Related: #?',
                                id: '123456789',
                                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123456789',
                            },
                        },
                    ],
                },
                upstream: {
                    data: [
                        {
                            sha: 'aab896e2135362ab126830c73284d4af0baad88a',
                            repo: 'systemd/systemd',
                            url: 'https://github.com/systemd/systemd/commit/aab896e2135362ab126830c73284d4af0baad88a',
                        },
                        {
                            sha: 'aab896e2135362ab126830c73284d4af0baad88a',
                            repo: 'systemd/systemd-stable',
                            url: 'https://github.com/systemd/systemd-stable/commit/aab896e2135362ab126830c73284d4af0baad88a',
                        },
                    ],
                    status: 'success',
                    exception: '',
                },
            },
        },
        {
            sha: '7474487a77b85f3bff943b97cb46d2b2643c8a9d',
            url: 'https://github.com/actions-private-playground/systemd-rhel9/commit/7474487a77b85f3bff943b97cb46d2b2643c8a9d',
            message: {
                title: 'docs: update unit name for sd-tmpfiles-setup',
                body: 'docs: update unit name for sd-tmpfiles-setup\n\n(cherry picked from commit 7d33146dbc1bd727a2923bb2da54856a7cb15fb5)\n\nResolves: #123456789',
                cherryPick: [
                    {
                        sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                    },
                ],
            },
            validation: {
                status: 'success',
                message: 'https://github.com/actions-private-playground/systemd-rhel9/commit/7474487a77b85f3bff943b97cb46d2b2643c8a9d - docs: update unit name for sd-tmpfiles-setup - https://github.com/systemd/systemd/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5 https://github.com/systemd/systemd-stable/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                tracker: {
                    status: 'success',
                    message: '123456789',
                    data: [
                        {
                            data: {
                                keyword: 'Resolves: #?',
                                id: '123456789',
                                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123456789',
                            },
                        },
                    ],
                },
                upstream: {
                    data: [
                        {
                            sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                            repo: 'systemd/systemd',
                            url: 'https://github.com/systemd/systemd/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                        },
                        {
                            sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                            repo: 'systemd/systemd-stable',
                            url: 'https://github.com/systemd/systemd-stable/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                        },
                    ],
                    status: 'success',
                    exception: '',
                },
            },
        },
        {
            sha: '9fa608c28d1737f27b0842f97317cbbcaab24282',
            url: 'https://github.com/actions-private-playground/systemd-rhel9/commit/9fa608c28d1737f27b0842f97317cbbcaab24282',
            message: {
                title: 'doc: update README.md',
                body: 'doc: update README.md\n\nrhel-only\n\nRelated: #123456789',
                cherryPick: [],
            },
            validation: {
                status: 'success',
                message: 'https://github.com/actions-private-playground/systemd-rhel9/commit/9fa608c28d1737f27b0842f97317cbbcaab24282 - doc: update README.md - rhel-only',
                tracker: {
                    status: 'success',
                    message: '123456789',
                    data: [
                        {
                            data: {
                                keyword: 'Related: #?',
                                id: '123456789',
                                url: 'https://bugzilla.redhat.com/show_bug.cgi?id=123456789',
                            },
                        },
                    ],
                },
                upstream: {
                    data: [],
                    status: 'success',
                    exception: 'rhel-only',
                },
            },
        },
        {
            sha: '45672bf3d175ecf314e0670be46be51704dffcca',
            url: 'https://github.com/actions-private-playground/systemd-rhel9/commit/45672bf3d175ecf314e0670be46be51704dffcca',
            message: {
                title: 'Update README',
                body: 'Update README',
                cherryPick: [],
            },
            validation: {
                status: 'failure',
                message: 'https://github.com/actions-private-playground/systemd-rhel9/commit/45672bf3d175ecf314e0670be46be51704dffcca - Update README - Missing upstream reference bangbang',
                tracker: {
                    status: 'success',
                    message: '',
                    data: [],
                },
                upstream: {
                    data: [],
                    status: 'failure',
                    exception: '',
                },
            },
        },
        {
            sha: 'a998f0556169717a25a80e8d7354b376a3d47379',
            url: 'https://github.com/actions-private-playground/systemd-rhel9/commit/a998f0556169717a25a80e8d7354b376a3d47379',
            message: {
                title: 'Update README',
                body: 'Update README\n\n(cherry picked from commit 7d33146dbc1bd727a2923bb2da54856a7cb15fb5)',
                cherryPick: [
                    {
                        sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                    },
                ],
            },
            validation: {
                status: 'success',
                message: 'https://github.com/actions-private-playground/systemd-rhel9/commit/a998f0556169717a25a80e8d7354b376a3d47379 - Update README - https://github.com/systemd/systemd/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5 https://github.com/systemd/systemd-stable/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                tracker: {
                    status: 'success',
                    message: '',
                    data: [],
                },
                upstream: {
                    data: [
                        {
                            sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                            repo: 'systemd/systemd',
                            url: 'https://github.com/systemd/systemd/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                        },
                        {
                            sha: '7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                            repo: 'systemd/systemd-stable',
                            url: 'https://github.com/systemd/systemd-stable/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5',
                        },
                    ],
                    status: 'success',
                    exception: '',
                },
            },
        },
    ],
    validation: {
        status: 'failure',
        tracker: {
            message: 'Missing issue tracker hand',
        },
        message: 'Tracker - Missing issue tracker hand\n\n#### The following commits meet all requirements\n\nhttps://github.com/actions-private-playground/systemd-rhel9/commit/2087c1213111cc054c894530794a6bc1ea58179d - virt: Further improve detection of EC2 metal instances - systemd/systemd@aab896e systemd/systemd-stable@aab896e2135362ab126830c73284d4af0baad88a\nhttps://github.com/actions-private-playground/systemd-rhel9/commit/7474487a77b85f3bff943b97cb46d2b2643c8a9d - docs: update unit name for sd-tmpfiles-setup - systemd/systemd@7d33146 systemd/systemd-stable@7d33146dbc1bd727a2923bb2da54856a7cb15fb5\nhttps://github.com/actions-private-playground/systemd-rhel9/commit/9fa608c28d1737f27b0842f97317cbbcaab24282 - doc: update README.md - rhel-only\nhttps://github.com/actions-private-playground/systemd-rhel9/commit/a998f0556169717a25a80e8d7354b376a3d47379 - Update README - systemd/systemd@7d33146 https://github.com/systemd/systemd-stable/commit/7d33146dbc1bd727a2923bb2da54856a7cb15fb5\n\n#### The following commits need inspection\n\nhttps://github.com/actions-private-playground/systemd-rhel9/commit/45672bf3d175ecf314e0670be46be51704dffcca - Update README - Missing upstream reference bangbang',
    },
};
export default action;
//# sourceMappingURL=action.js.map