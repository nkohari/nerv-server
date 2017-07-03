import Handler from './Handler';

interface HandlerConfig {
  auth: string | boolean;
}

export interface HandlerClass {
  config?: HandlerConfig;
  new (...args: any[]): Handler;
}
