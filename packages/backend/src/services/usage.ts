import { CoreClient } from '../client';
import * as Schema from '../schema';

export class UsageService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/usage/balance/{resourceType}/{resourceId}/{limitType}
   * @summary Get wallet balance
   */
  getBalance(
    resourceType: Schema.ResourceType,
    resourceId: string,
    limitType: string,
    query?: Schema.UsageGetBalanceQuery,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.BalanceResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/usage/balance/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/${encodeURIComponent(limitType)}`,
      query,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/usage/check
   * @summary Check if consumption is allowed
   */
  checkLimit(
    body: Schema.UsageCheckBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.CheckLimitResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/check`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * POST /v1/usage/consume
   * @summary Record consumption (inserts negative amount)
   */
  consume(
    body: Schema.UsageConsumeBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.UsageWalletResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/consume`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * POST /v1/usage/credit
   * @summary Add credits to wallet (inserts positive amount)
   */
  credit(
    body: Schema.UsageCreditBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.UsageWalletResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/credit`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * GET /v1/usage/transactions/{resourceType}/{resourceId}/{limitType}
   * @summary Get transaction history
   */
  getTransactionHistory(
    resourceType: Schema.ResourceType,
    resourceId: string,
    limitType: string,
    query?: Schema.UsageGetTransactionHistoryQuery,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.TransactionHistoryResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/usage/transactions/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/${encodeURIComponent(limitType)}`,
      query,
      ...(init || {}),
    });
  }
}
