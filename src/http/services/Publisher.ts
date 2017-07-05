import * as ioredis from 'ioredis';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import { Server } from 'hapi';
import { User } from '../../db';

class Publisher {

  log: Logger;
  server: Server;
  reader: ioredis.Redis;
  writer: ioredis.Redis;
  connectedUsers: Set<User>;

  constructor(log: Logger) {
    this.log = log;
    this.connectedUsers = new Set<User>();
    this.reader = new ioredis(nconf.get('REDIS_PORT'), nconf.get('REDIS_HOST'));
    this.writer = new ioredis(nconf.get('REDIS_PORT'), nconf.get('REDIS_HOST'));
  }

  start(server: Server) {
    this.server = server;
    this.server.subscription('/events/{userid}', {
      auth: { mode: 'required' },
      filter: (path, message, options, next) => {
        const user = options.credentials;
        next(options.params.userid === user.id);
      }
    });
    this.reader.psubscribe('events:*');
    this.reader.on('pmessage', this.onMessageFromRedis);
  }

  stop() {
    this.reader.disconnect();
    this.writer.disconnect();
  }

  publish(userid: string, message: any) {
    this.writer.publish(`events:${userid}`, JSON.stringify(message));
  }

  private onMessageFromRedis = (pattern: string, channel: string, json: any) => {
    const tokens = channel.split(':');
    const message = JSON.parse(json);
    this.log.debug(`Received redis message on ${channel}, sending to user ${tokens[1]}`, { message });
    this.server.publish(`/events/${tokens[1]}`, json);
  }

}

export default Publisher;
