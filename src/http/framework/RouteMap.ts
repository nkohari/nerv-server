import { HandlerClass } from 'src/http/framework';

export interface RouteMap {
  [ route: string ]: HandlerClass;
}
