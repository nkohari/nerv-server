import { RouteMap } from './framework';
import { LoginHandler, GetUserHandler, CreateUserHandler } from './handlers';

const routes: RouteMap = {
  'post /login': LoginHandler,
  'get /users/{userid}': GetUserHandler,
  'post /users': CreateUserHandler
};

export default routes;
