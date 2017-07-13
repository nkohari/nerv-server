import * as ioredis from 'ioredis';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import * as uuid from 'uuid/v4';
import { groupBy } from 'lodash';
import { Server } from 'hapi';
import { Measure, Model } from 'src/db';
import Credentials from 'src/common/security/Credentials';
import Message from './Message';

class MessageBus {

  ident: string;
  log: Logger;
  server: Server;
  reader: ioredis.Redis;
  writer: ioredis.Redis;

  constructor(log: Logger) {
    this.ident = uuid();
    this.log = log;
    this.reader = new ioredis(nconf.get('REDIS_PORT'), nconf.get('REDIS_HOST'));
    this.writer = new ioredis(nconf.get('REDIS_PORT'), nconf.get('REDIS_HOST'));
  }

  start(server: Server) {
    this.server = server;
    this.server.subscription('/changes', {
      auth: { mode: 'required' },
      filter: (path, message, options, next) => {
        const credentials = options.credentials as Credentials;
        next(credentials.canAccess(message.groupid));
      }
    });
    this.server.subscription('/data', {
      auth: { mode: 'required' },
      filter: (path, message, options, next) => {
        const credentials = options.credentials as Credentials;
        next(credentials.canAccess(message.groupid));
      }
    });
    this.reader.psubscribe('changes:*');
    this.reader.psubscribe('data:*');
    this.reader.on('pmessage', this.onMessageFromRedis);
  }

  stop() {
    this.reader.disconnect();
    this.writer.disconnect();
  }

  announce(op: 'create' | 'update', models: Model[]) {
    models.forEach(model => {
      const { groupid } = model.getSecurityContext();
      if (groupid) {
        const message = new Message({
          sender: this.ident,
          groupid,
          body: { type: model.constructor.name, op, model }
        });
        this.server.publish('/changes', message);
        this.writer.publish(`changes:${groupid}`, JSON.stringify(message));
      }
    });
  }

  announceData(measures: Measure[]) {
    const groups = groupBy(measures, m => m.groupid);
    for (let groupid in groups) {
      const message = new Message({
        sender: this.ident,
        groupid,
        body: { measures: groups[groupid] }
      });
      this.server.publish('/data', message);
      this.writer.publish(`data:${groupid}`, JSON.stringify(message));
    }
  }

  private onMessageFromRedis = (pattern: string, channel: string, json: any) => {
    const message = new Message(JSON.parse(json));

    // Ignore our own messages.
    if (message.sender === this.ident) return;

    switch (pattern) {

      case 'changes:*':
        this.log.debug(`Group ${message.groupid} received change event for ${message.body.type}#${message.body.model.id}`, message.body);
        this.server.publish('/changes', message);
        break;

      case 'data:*':
        this.log.debug(`Group ${message.groupid} received data event with ${message.body.length} measures`, message.body);
        this.server.publish('/data', message);
        break;

      default:
        throw new Error(`Received message on unknown pattern ${pattern}`);

    }
  }

}

export default MessageBus;
