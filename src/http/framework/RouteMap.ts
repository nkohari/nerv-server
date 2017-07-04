import { HandlerClass } from './HandlerClass';

export interface RouteMap {
  [ route: string ]: HandlerClass;
}
