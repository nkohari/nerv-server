import Handler from './Handler';

export interface HandlerClass {
  auth?: any;
  pre?: any[];
  validate?: any;
  new (...args: any[]): Handler;
}
