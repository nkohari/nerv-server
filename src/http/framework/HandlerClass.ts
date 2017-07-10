import { Handler } from 'src/http/framework';

export interface HandlerClass {
  auth?: any;
  pre?: any[];
  validate?: any;
  new (...args: any[]): Handler;
}
