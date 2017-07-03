import * as Logger from 'bunyan';
import Forge from 'forge-di';
import Environment from './Environment';

abstract class Application {

  name: string;
  forge: Forge;
  log: Logger;

  constructor(name: string, environment: Environment) {
    this.name = name;
    this.forge = environment.setup(this);
    this.log = this.forge.get<Logger>('log');
    this.log.info(`Starting ${this.name}`);
  }

  setupEvents() {
    process.on('SIGINT', () => {
      this.log.info(`Caught SIGINT, stopping ${this.name}`);
      this.stop();
    });
    process.on('SIGTERM', () => {
      this.log.info(`Caught SIGTERM, stopping ${this.name}`);
      this.stop();
    });
    process.stdin.on('close', () => {
      this.log.info(`STDIN closed unexpectedly, stopping ${this.name}`);
      this.stop(1);
    });
  }

  start() {
    this.log.info(`Started ${this.name} application`);
  }

  stop(exitCode: number = 0) {
    this.log.info(`Stopped ${this.name} application`);
    process.exit(exitCode);
  }

}

export default Application;
