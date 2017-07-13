import * as knex from 'knex';
import * as nconf from 'nconf';
import { MessageBus } from 'src/common';
import { Executor, Query, Statement, Command } from 'src/db/framework';
import { Transaction } from 'src/db';

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

  getRawConnection() {
    return this.connection;
  }

  query<T>(query: Query<T>): Promise<T> {
    return query.execute(this.connection);
  }

  execute<T>(statement: Statement<T>): Promise<T> {
    return statement.execute(this.connection, this.messageBus);
  }

  run<T>(command: Command<T>): Promise<T> {
    return this.connection.transaction(tx => {
      return command.run(new Transaction(tx, this.messageBus));
    });
  }

}

export default Database;
