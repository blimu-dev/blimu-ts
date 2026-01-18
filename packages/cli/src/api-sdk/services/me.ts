import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class MeService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/me/access*
   * @summary Get active resources for current user*/
  getAccess(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.UserAccessDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/me/access`,
      ...(init || {}),
    });
  }
}
