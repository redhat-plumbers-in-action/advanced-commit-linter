import { debug } from '@actions/core';
import { context } from '@actions/github';
export async function setLabels(octokit, issueNumber, labels) {
    if (labels.length === 0) {
        debug('No labels to set');
        return;
    }
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', Object.assign(Object.assign({}, context.repo), { issue_number: issueNumber, labels }));
}
export async function removeLabel(octokit, issueNumber, label) {
    await octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', Object.assign(Object.assign({}, context.repo), { issue_number: issueNumber, name: label }));
}
//# sourceMappingURL=util.js.map