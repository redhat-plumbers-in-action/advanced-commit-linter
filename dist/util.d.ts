import { CustomOctokit } from './octokit';
export declare function setLabels(octokit: CustomOctokit, issueNumber: number, labels: string[]): Promise<void>;
export declare function removeLabel(octokit: CustomOctokit, issueNumber: number, label: string): Promise<void>;
