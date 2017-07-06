import { RouteMap } from '../framework/RouteMap';
import { default as LoginHandler } from './LoginHandler';
import { default as GetAgentHandler } from './agents/GetAgentHandler';
import { default as ListAgentsHandler } from './agents/ListAgentsHandler';
import { default as GetGroupHandler } from './groups/GetGroupHandler';
import { default as ListGroupsHandler } from './groups/ListGroupsHandler';
import { default as GetMembershipHandler } from './memberships/GetMembershipHandler';
import { default as ListMembershipsHandler } from './memberships/ListMembershipsHandler';
import { default as CreateUserHandler } from './users/CreateUserHandler';
import { default as GetUserHandler } from './users/GetUserHandler';

export {
  CreateUserHandler,
  GetAgentHandler,
  GetGroupHandler,
  GetMembershipHandler,
  GetUserHandler,
  ListAgentsHandler,
  ListGroupsHandler,
  ListMembershipsHandler,
  LoginHandler
};

export const routes: RouteMap = {
  'get /groups': ListGroupsHandler,
  'get /groups/{groupid}': GetGroupHandler,
  'get /groups/{groupid}/agents': ListAgentsHandler,
  'get /groups/{groupid}/agents/{agentid}': GetAgentHandler,
  'get /groups/{groupid}/memberships': ListMembershipsHandler,
  'get /groups/{groupid}/memberships/{membershipid}': GetMembershipHandler,
  'post /users': CreateUserHandler,
  'get /users/{userid}': GetUserHandler,
  'post /login': LoginHandler
};
