import * as knex from 'knex';
import * as nconf from 'nconf';
import { MessageBus } from '../common';
import { Executor, Statement } from './framework';
import Transaction from './Transaction';

type TransactionScope = (transaction: Transaction) => Promise<any>;

class Database extends Executor {

  private connection: knex;
  private messageBus: MessageBus;

  constructor(messageBus: MessageBus) {
    super();
    this.messageBus = messageBus;
    this.connection = knex({
      client: 'postgresql',
      connection: {
        database: nconf.get('DB_DATABASE'),
        user: nconf.get('DB_USER'),
        password: nconf.get('DB_PASSWORD'),
        host: nconf.get('DB_HOST'),
        port: nconf.get('DB_PORT'),
        ssl: nconf.get('DB_TLS')
      },
      pool: {
        max: 10,
        idleTimeoutMillis: 30000
      }
    });
  }

  execute<T>(statement: Statement<T>): Promise<T> {
    return statement.execute(this.connection, this.messageBus);
  }

  transaction(scope: TransactionScope): Promise<any> {
    return this.connection.transaction(tx => {
      return scope(new Transaction(tx, this.messageBus));
    });
  }

}

export default Database;
