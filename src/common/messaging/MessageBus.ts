import * as ioredis from 'ioredis';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import * as uuid from 'uuid/v4';
import { groupBy } from 'lodash';
import { Server } from 'hapi';
import { Credentials, Audience } from 'src/common';
import { Measure, Model, ExchangeRate, NetworkData } from 'src/db';
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
      filter: (path, message: Message, options, next) => {
        const credentials = options.credentials as Credentials;
        next(credentials.isMemberOf(message.audience));
      }
    });
    this.server.subscription('/measures', {
      auth: { mode: 'required' },
      filter: (path, message: Message, options, next) => {
        const credentials = options.credentials as Credentials;
        next(credentials.isMemberOf(message.audience));
      }
    });
    this.server.subscription('/metadata', {
      auth: { mode: 'required' }
    });
    this.reader.subscribe('changes');
    this.reader.subscribe('measures');
    this.reader.subscribe('metadata');
    this.reader.on('message', this.onMessageFromRedis);
  }

  stop() {
    this.reader.disconnect();
    this.writer.disconnect();
  }

  announce(op: 'create' | 'update', models: Model[]) {
    models.forEach(model => {
      const message = new Message({
        sender: this.ident,
        audience: model.getAudience(),
        body: { type: model.constructor.name, op, model }
      });
      this.server.publish('/changes', message);
      this.writer.publish('changes', JSON.stringify(message));
    });
  }

  announceMeasures(measures: Measure[]) {
    const groups = groupBy(measures, m => m.groupid);
    for (let groupid in groups) {
      const message = new Message({
        sender: this.ident,
        audience: new Audience({ groupid }),
        body: { measures: groups[groupid] }
      });
      this.server.publish('/measures', message);
      this.writer.publish('measures', JSON.stringify(message));
    }
  }

  announceMetadata(metadata: ExchangeRate[] | NetworkData[]) {
    if (metadata.length > 0) {
      const message = new Message({
        sender: this.ident,
        audience: Audience.PUBLIC,
        body: { type: metadata[0].constructor.name, metadata }
      });
      this.server.publish('/metadata', message);
      this.writer.publish('metadata', JSON.stringify(message));
    }
  }

  private onMessageFromRedis = (channel: string, json: any) => {
    const message = new Message(JSON.parse(json));

    // Ignore our own messages.
    if (message.sender === this.ident) return;

    switch (channel) {

      case 'changes':
        this.log.debug(`Audience ${message.audience} received change event for ${message.body.type}#${message.body.model.id}`, message.body);
        this.server.publish('/changes', message);
        break;

      case 'measures':
        this.log.debug(`Audience ${message.audience} received measures event with ${message.body.length} measures`, message.body);
        this.server.publish('/measures', message);
        break;

      case 'metadata':
        this.log.debug(`Audience ${message.audience} received metadata event`, message.body);
        this.server.publish('/metadata', message);
        break;

      default:
        throw new Error(`Received message on unknown channel ${channel}`);

    }
  }

}

export default MessageBus;
