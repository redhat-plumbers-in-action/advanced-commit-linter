import { Context } from 'probot';
import { error } from '@actions/core';
import { z } from 'zod';

import { events } from '../events';

import {
  ConfigCherryPickT,
  configExceptionSchema,
  ConfigExceptionT,
  ConfigT,
} from '../schema/config';
import { SingleCommitMetadataT } from '../schema/input';
import {
  StatusT,
  upstreamDataSchema,
  UpstreamT,
  ValidatedCommitT,
} from '../schema/output';

export class UpstreamValidator {
  constructor(
    public config: ConfigT['policy']['cherry-pick'],
    public isCherryPickPolicyEmpty: boolean
  ) {}

  async validate(
    singleCommitMetadata: SingleCommitMetadataT,
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<UpstreamT | undefined> {
    let data: UpstreamT['data'] = [];

    for (const cherryPick of singleCommitMetadata.message.cherryPick) {
      data = data.concat(await this.loopPolicy(cherryPick, context));
    }

    const result: UpstreamT = {
      data,
      status: 'failure',
      exception: this.isException(
        this.config.exception,
        singleCommitMetadata.message.body
      ),
    };

    result.status = this.getStatus(result.data, result.exception);

    return result;
  }

  async loopPolicy(
    cherryPick: SingleCommitMetadataT['message']['cherryPick'][number],
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<UpstreamT['data']> {
    return this.cleanArray(
      this.config.upstream.map(async upstream => {
        return await this.verifyCherryPick(cherryPick, upstream, context);
      })
    );
  }

  // TODO: return undefined if all upstreams are empty
  async verifyCherryPick(
    cherryPick: SingleCommitMetadataT['message']['cherryPick'][number],
    upstream: ConfigCherryPickT['upstream'][number],
    context: {
      [K in keyof typeof events]: Context<(typeof events)[K][number]>;
    }[keyof typeof events]
  ): Promise<Partial<UpstreamT['data'][number]>> {
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

  isException(
    exceptionPolicy: ConfigExceptionT | undefined,
    commitBody: string
  ) {
    const exceptionPolicySafe = configExceptionSchema
      .extend({ note: z.array(z.string()) })
      .safeParse(exceptionPolicy);

    if (!exceptionPolicySafe.success) return '';

    for (const exception of exceptionPolicySafe.data.note) {
      const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
      const matches = commitBody.matchAll(regexp);

      for (const match of matches) {
        if (Array.isArray(match) && match.length >= 3) {
          return exception;
        }
      }
    }

    return '';
  }

  getStatus(
    data: UpstreamT['data'],
    exception: UpstreamT['exception']
  ): StatusT {
    let status: StatusT = 'failure';

    if (data.length > 0 || exception || this.isCherryPickPolicyEmpty) {
      status = 'success';
    }

    return status;
  }

  async cleanArray(
    validationArray: Promise<Partial<UpstreamT['data'][number]>>[]
  ): Promise<UpstreamT['data']> {
    if (validationArray === undefined) return [];

    const data = await Promise.all(validationArray);

    const filtered = data.filter(
      item => JSON.stringify(item) !== JSON.stringify({})
    );

    const parsed = z.array(upstreamDataSchema).safeParse(filtered);

    return parsed.success ? parsed.data : [];
  }

  summary(
    data: ValidatedCommitT['upstream']
  ): Pick<ValidatedCommitT, 'status' | 'message'> {
    if (
      (data === undefined || data.data.length === 0) &&
      this.config.upstream.length > 0 &&
      data?.exception === ''
    )
      return {
        status: 'failure',
        message: '**Missing upstream reference** ‼️',
      };

    if (
      (data === undefined || data.data.length === 0) &&
      data?.exception === ''
    )
      return { status: 'success', message: '_no upstream_' };

    const message: string[] = [];

    if (data?.exception) {
      message.push(`\`${data.exception}\``);
    }

    data?.data.forEach(upstream => {
      message.push(`${upstream.url}`);
    });

    return { status: 'success', message: message.join(' ') };
  }
}
