import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class WorkspaceMembersService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces/{workspaceId}/members*
   * @summary List workspace members with pagination and search*/
  list(
    workspaceId: string,
    query?: Schema.WorkspaceMembersListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.MemberListResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/members`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/workspaces/{workspaceId}/members/{userId}*
   * @summary Remove member from workspace*/
  remove(
    workspaceId: string,
    userId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspaces/{workspaceId}/members/{userId}/role*
   * @summary Update member role*/
  updateRole(
    workspaceId: string,
    userId: string,
    body: Schema.UpdateRoleDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}/role`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/members/invite*
   * @summary Invite a member to the workspace*/
  invite(
    workspaceId: string,
    body: Schema.InviteMemberDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.InviteMemberResponseDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/members/invite`,
      body,
      ...(init ?? {}),
    });
  }
}
