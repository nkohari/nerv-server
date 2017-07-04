import Handler from './Handler';

export interface HandlerClass {
  auth?: any;
  pre?: any[];
  new (...args: any[]): Handler;
}
