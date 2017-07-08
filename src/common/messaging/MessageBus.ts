import * as ioredis from 'ioredis';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import * as uuid from 'uuid/v4';
import { Server } from 'hapi';
import { Model } from '../../db';
import Credentials from '../security/Credentials';
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
    this.reader.psubscribe('changes:*');
    this.reader.on('pmessage', this.onMessageFromRedis);
  }

  stop() {
    this.reader.disconnect();
    this.writer.disconnect();
  }

  announce(op: 'create' | 'update', models: Model[]) {
    models.forEach(model => {
      const context = model.getSecurityContext();
      if (context.groupid) {
        this.publish(context.groupid, {
          op,
          type: model.constructor.name,
          model
        });
      }
    });
  }

  publish(groupid: string, body: any) {
    const message = new Message({
      sender: this.ident,
      groupid,
      body
    });
    this.server.publish('/changes', message);
    this.writer.publish(`changes:${groupid}`, JSON.stringify(message));
  }

  private onMessageFromRedis = (pattern: string, channel: string, json: any) => {
    const message = new Message(JSON.parse(json));

    // Ignore our own messages.
    if (message.sender === this.ident) return;

    if (pattern === 'changes:*') {
      this.log.debug(`Received change event for ${message.body.type}#${message.body.model.id}`, message.body);
      this.server.publish('/changes', message);
    }
  }

}

export default MessageBus;
