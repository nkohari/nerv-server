import { RouteMap } from './framework';
import { LoginHandler, GetUserHandler, CreateUserHandler } from './handlers';

const routes: RouteMap = {
  'post /login': LoginHandler,
  'post /users': CreateUserHandler,
  'get /users/{userid}': GetUserHandler
};

export default routes;
