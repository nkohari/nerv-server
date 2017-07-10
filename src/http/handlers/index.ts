import { RouteMap } from '../framework/RouteMap';

import { default as CreateAgentHandler } from './agents/CreateAgentHandler';
import { default as CreateDeviceHandler } from './devices/CreateDeviceHandler';
import { default as CreateGroupHandler } from './groups/CreateGroupHandler';
import { default as CreateUserHandler } from './users/CreateUserHandler';
import { default as GetAgentHandler } from './agents/GetAgentHandler';
import { default as GetDeviceHandler } from './devices/GetDeviceHandler';
import { default as GetGroupHandler } from './groups/GetGroupHandler';
import { default as GetMembershipHandler } from './memberships/GetMembershipHandler';
import { default as GetTokenHandler } from './auth/GetTokenHandler';
import { default as GetUserHandler } from './users/GetUserHandler';
import { default as ListAgentsByGroupHandler } from './agents/ListAgentsByGroupHandler';
import { default as ListAgentsByUserHandler } from './agents/ListAgentsByUserHandler';
import { default as ListDevicesByAgentHandler } from './devices/ListDevicesByAgentHandler';
import { default as ListDevicesByGroupHandler } from './devices/ListDevicesByGroupHandler';
import { default as ListGroupsByUserHandler } from './groups/ListGroupsByUserHandler';
import { default as ListMembershipsByGroupHandler } from './memberships/ListMembershipsByGroupHandler';
import { default as LoginHandler } from './auth/LoginHandler';
import { default as UpdateAgentHandler } from './agents/UpdateAgentHandler';
import { default as UpdateGroupHandler } from './groups/UpdateGroupHandler';

export const routes: RouteMap = {
  // Groups
  'post /groups': CreateGroupHandler,
  'get /groups': ListGroupsByUserHandler,
  'get /groups/{groupid}': GetGroupHandler,
  'put /groups/{groupid}': UpdateGroupHandler,
  // Agents
  'get /agents': ListAgentsByUserHandler,
  'post /groups/{groupid}/agents': CreateAgentHandler,
  'get /groups/{groupid}/agents': ListAgentsByGroupHandler,
  'get /groups/{groupid}/agents/{agentid}': GetAgentHandler,
  'put /groups/{groupid}/agents/{agentid}': UpdateAgentHandler,
  // Devices
  'get /groups/{groupid}/devices': ListDevicesByGroupHandler,
  'post /groups/{groupid}/agents/{agentid}/devices': CreateDeviceHandler,
  'get /groups/{groupid}/agents/{agentid}/devices': ListDevicesByAgentHandler,
  'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}': GetDeviceHandler,
  // Memberships
  'get /groups/{groupid}/memberships': ListMembershipsByGroupHandler,
  'get /groups/{groupid}/memberships/{membershipid}': GetMembershipHandler,
  // Users
  'post /users': CreateUserHandler,
  'get /users/{userid}': GetUserHandler,
  // Auth
  'post /auth': LoginHandler,
  'get /auth': GetTokenHandler
};

export {
  CreateAgentHandler,
  CreateGroupHandler,
  CreateUserHandler,
  GetAgentHandler,
  GetGroupHandler,
  GetMembershipHandler,
  GetTokenHandler,
  GetUserHandler,
  ListAgentsByGroupHandler,
  ListAgentsByUserHandler,
  ListGroupsByUserHandler,
  ListMembershipsByGroupHandler,
  LoginHandler,
  UpdateAgentHandler,
  UpdateGroupHandler
};
