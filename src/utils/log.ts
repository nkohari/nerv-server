import * as Logger from 'bunyan';

let logger;

export function start(name: string) {
  logger = Logger.createLogger({ name });
}

export default logger;
