import { error } from '@actions/core';
import { z } from 'zod';

import { ConfigCherryPick } from '../schema/config';
import { SingleCommitMetadata } from '../schema/input';
import { Status, upstreamDataSchema, Upstream } from '../schema/output';
import { CustomOctokit } from '../octokit';
import { isException } from './util';

export class UpstreamValidator {
  constructor(
    public config: ConfigCherryPick,
    public isCherryPickPolicyEmpty: boolean
  ) {}

  async validate(
    singleCommitMetadata: SingleCommitMetadata,
    octokit: CustomOctokit
  ): Promise<Upstream | undefined> {
    let data: Upstream['data'] = [];

    for (const cherryPick of singleCommitMetadata.message.cherryPick) {
      data = data.concat(await this.loopPolicy(cherryPick, octokit));
    }

    const exception = isException(
      this.config.exception,
      singleCommitMetadata.message.body
    );

    return {
      data,
      status: this.getStatus(data, exception),
      exception,
    };
  }

  async loopPolicy(
    cherryPick: SingleCommitMetadata['message']['cherryPick'][number],
    octokit: CustomOctokit
  ): Promise<Upstream['data']> {
    return this.cleanArray(
      this.config.upstream.map(async upstream => {
        return await this.verifyCherryPick(cherryPick, upstream, octokit);
      })
    );
  }

  async verifyCherryPick(
    cherryPick: SingleCommitMetadata['message']['cherryPick'][number],
    upstream: ConfigCherryPick['upstream'][number],
    octokit: CustomOctokit
  ): Promise<Partial<Upstream['data'][number]>> {
    try {
      const { status, data } = await octokit.request(
        'GET /repos/{owner}/{repo}/commits/{ref}',
        {
          owner: upstream.github.split('/')[0],
          repo: upstream.github.split('/')[1],
          ref: cherryPick.sha,
        }
      );

      return status === 200
        ? { sha: data.sha, repo: upstream.github, url: data.html_url }
        : {};
    } catch (e) {
      error(`Error ocurred when verifying upstream commit: ${e}`);
    }

    return {};
  }

  getStatus(data: Upstream['data'], exception: Upstream['exception']): Status {
    return data.length > 0 || exception || this.isCherryPickPolicyEmpty
      ? 'success'
      : 'failure';
  }

  async cleanArray(
    validationArray: Promise<Partial<Upstream['data'][number]>>[]
  ): Promise<Upstream['data']> {
    if (validationArray === undefined) return [];

    const data = await Promise.all(validationArray);
    const filtered = data.filter(item => Object.keys(item).length > 0);
    const parsed = z.array(upstreamDataSchema).safeParse(filtered);

    return parsed.success ? parsed.data : [];
  }
}
