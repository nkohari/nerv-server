import { RouteMap } from './framework/RouteMap';
import CreateUserHandler from './handlers/CreateUserHandler';
import ListAgentsHandler from './handlers/ListAgentsHandler';
import LoginHandler from './handlers/LoginHandler';

const routes: RouteMap = {
  'post /login': LoginHandler,
  'post /users': CreateUserHandler,
  'get /agents': ListAgentsHandler
};

export default routes;
