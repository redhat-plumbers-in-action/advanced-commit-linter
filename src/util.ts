import { debug } from '@actions/core';
import { context } from '@actions/github';

import { CustomOctokit } from './octokit';

export async function setLabels(
  octokit: CustomOctokit,
  issueNumber: number,
  labels: string[]
): Promise<void> {
  if (labels.length === 0) {
    debug('No labels to set');
    return;
  }

  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/labels',
    {
      ...context.repo,
      issue_number: issueNumber,
      labels,
    }
  );
}

export async function removeLabel(
  octokit: CustomOctokit,
  issueNumber: number,
  label: string
): Promise<void> {
  await octokit.request(
    'DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}',
    {
      ...context.repo,
      issue_number: issueNumber,
      name: label,
    }
  );
}
