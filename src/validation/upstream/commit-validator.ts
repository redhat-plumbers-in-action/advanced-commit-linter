import { error } from '@actions/core';
import { Context } from 'probot';
import { z } from 'zod';

import { events } from '../../events';
import { isException } from '../util';

import { ConfigCherryPick } from '../../schema/config';
import { SingleCommitMetadata } from '../../schema/input';
import {
  Status,
  upstreamDataSchema,
  Upstream,
  ValidatedCommit,
} from '../../schema/output';
import { Config } from '../../config';
import { Commit } from '../../commit';

export class UpstreamCommitValidator {
  upstreamData: Upstream['data'] = [];
  exception: Upstream['exception'];
  status: Status = 'failure';

  constructor(readonly config: Config, readonly commit: Commit) {
    this.config.cherryPick.upstream.forEach(singleUpstreamConfig => {
      this.upstreamData.push(
        this.validate(singleUpstreamConfig, commit.metadata.message.body)
      );
    });

    this.exception = isException();
    this.status = this.overallStatus(this.trackers);
  }

  async validate(
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<Upstream | undefined> {
    let data: Upstream['data'] = [];

    for (const cherryPick of singleCommitMetadata.message.cherryPick) {
      data = data.concat(await this.loopPolicy(cherryPick, context));
    }

    const result: Upstream = {
      data,
      status: 'failure',
      // TODO: `?? ''` is workaround. It should be removed after check in general message is updated.
      exception:
        isException(this.config.exception, singleCommitMetadata.message.body) ??
        '',
    };

    result.status = this.getStatus(result.data, result.exception);

    return result;
  }

  async loopPolicy(
    cherryPick: SingleCommitMetadata['message']['cherryPick'][number],
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<Upstream['data']> {
    return this.cleanArray(
      this.config.upstream.map(async upstream => {
        return await this.verifyCherryPick(cherryPick, upstream, context);
      })
    );
  }

  // TODO: return undefined if all upstreams are empty
  async verifyCherryPick(
    cherryPick: SingleCommitMetadata['message']['cherryPick'][number],
    upstream: ConfigCherryPick['upstream'][number],
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<Partial<Upstream['data'][number]>> {
    try {
      const { status, data } = await context.octokit.repos.getCommit({
        owner: upstream.github.split('/')[0],
        repo: upstream.github.split('/')[1],
        ref: cherryPick.sha,
      });

      return status === 200
        ? { sha: data.sha, repo: upstream.github, url: data.html_url }
        : {};
    } catch (e) {
      error(`Error ocurred when verifying upstream commit: ${e}`);
    }

    return {};
  }

  getStatus(data: Upstream['data'], exception: Upstream['exception']): Status {
    let status: Status = 'failure';

    if (data.length > 0 || exception || this.isCherryPickPolicyEmpty) {
      status = 'success';
    }

    return status;
  }

  async cleanArray(
    validationArray: Promise<Partial<Upstream['data'][number]>>[]
  ): Promise<Upstream['data']> {
    if (validationArray === undefined) return [];

    const data = await Promise.all(validationArray);

    const filtered = data.filter(
      item => JSON.stringify(item) !== JSON.stringify({})
    );

    const parsed = z.array(upstreamDataSchema).safeParse(filtered);

    return parsed.success ? parsed.data : [];
  }

  summary(
    data: ValidatedCommit,
    validation: {
      upstream: boolean;
      tracker: boolean;
    }
  ): Pick<ValidatedCommit, 'status' | 'message'> {
    const validationSummary: Pick<ValidatedCommit, 'status' | 'message'> = {
      status: 'success',
      message: '',
    };

    const message: string[] = [];

    if (validation.tracker) {
      if (data.tracker && data.tracker.status === 'failure') {
        validationSummary.status = 'failure';
        message.push(data.tracker.message);
      }
    }

    if (validation.upstream) {
      if (data.upstream && data.upstream.status === 'failure') {
        validationSummary.status = 'failure';
        message.push('**Missing upstream reference** ‼️');
      }
    }

    if (validationSummary.status === 'failure') {
      validationSummary.message = message.join('</br>');
      return validationSummary;
    }

    if (
      (!data.upstream || data.upstream.data.length === 0) &&
      data.upstream?.exception === ''
    )
      return { status: 'success', message: '_no upstream_' };

    if (data.upstream?.exception) {
      message.push(`\`${data.upstream?.exception}\``);
    }

    data.upstream?.data.forEach(upstream => {
      message.push(`${upstream.url}`);
    });

    return { status: 'success', message: message.join('</br>') };
  }
}
