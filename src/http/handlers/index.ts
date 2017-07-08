import { RouteMap } from '../framework/RouteMap';

import { default as CreateUserHandler } from './users/CreateUserHandler';
import { default as GetAgentHandler } from './agents/GetAgentHandler';
import { default as GetGroupHandler } from './groups/GetGroupHandler';
import { default as GetMembershipHandler } from './memberships/GetMembershipHandler';
import { default as GetTokenHandler } from './auth/GetTokenHandler';
import { default as GetUserHandler } from './users/GetUserHandler';
import { default as ListAgentsHandler } from './agents/ListAgentsHandler';
import { default as ListGroupsHandler } from './groups/ListGroupsHandler';
import { default as ListMembershipsHandler } from './memberships/ListMembershipsHandler';
import { default as LoginHandler } from './auth/LoginHandler';
import { default as UpdateGroupHandler } from './groups/UpdateGroupHandler';

export {
  CreateUserHandler,
  GetAgentHandler,
  GetGroupHandler,
  GetMembershipHandler,
  GetTokenHandler,
  GetUserHandler,
  ListAgentsHandler,
  ListGroupsHandler,
  ListMembershipsHandler,
  LoginHandler,
  UpdateGroupHandler
};

export const routes: RouteMap = {
  'get /groups': ListGroupsHandler,
  'get /groups/{groupid}': GetGroupHandler,
  'put /groups/{groupid}': UpdateGroupHandler,
  'get /groups/{groupid}/agents': ListAgentsHandler,
  'get /groups/{groupid}/agents/{agentid}': GetAgentHandler,
  'get /groups/{groupid}/memberships': ListMembershipsHandler,
  'get /groups/{groupid}/memberships/{membershipid}': GetMembershipHandler,
  'post /users': CreateUserHandler,
  'get /users/{userid}': GetUserHandler,
  'post /auth': LoginHandler,
  'get /auth': GetTokenHandler
};
