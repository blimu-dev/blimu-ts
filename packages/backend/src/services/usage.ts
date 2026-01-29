import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class UsageService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/usage/balance/{resourceType}/{resourceId}/{limitType}*
   * @summary Get wallet balance*
   * @description Retrieves the current balance of a usage wallet for a specific resource and limit type within a given time period. The balance reflects all credits and consumption transactions.*/
  getBalance(
    resourceType: string,
    resourceId: string,
    limitType: string,
    query?: Schema.UsageGetBalanceQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.BalanceResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/usage/balance/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/${encodeURIComponent(limitType)}`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/usage/check*
   * @summary Check if consumption is allowed*
   * @description Checks whether a specific amount of consumption is allowed for a resource and limit type within a given time period. Returns the current balance, requested amount, and remaining balance after the consumption.*/
  checkLimit(
    body: Schema.UsageCheckBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.CheckLimitResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/check`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/usage/consume*
   * @summary Record consumption (inserts negative amount)*
   * @description Records consumption from a usage wallet for a specific resource and limit type. This decreases the available balance. Consumption can be tagged for tracking purposes.*/
  consume(
    body: Schema.UsageConsumeBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.UsageWalletResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/consume`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/usage/credit*
   * @summary Add credits to wallet (inserts positive amount)*
   * @description Adds credits to a usage wallet for a specific resource and limit type. This increases the available balance for usage-based limits. Credits can be tagged for tracking purposes.*/
  credit(
    body: Schema.UsageCreditBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.UsageWalletResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/usage/credit`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/usage/transactions/{resourceType}/{resourceId}/{limitType}*
   * @summary Get transaction history*
   * @description Retrieves the transaction history for a usage wallet, including all credits and consumption records. Supports filtering by time period and date range.*/
  getTransactionHistory(
    resourceType: string,
    resourceId: string,
    limitType: string,
    query?: Schema.UsageGetTransactionHistoryQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.TransactionHistoryResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/usage/transactions/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/${encodeURIComponent(limitType)}`,
      query,
      ...(init ?? {}),
    });
  }
}
