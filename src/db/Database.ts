import * as knex from 'knex';
import * as nconf from 'nconf';
import { Model, ModelClass, Statement } from './framework';
import GetQuery from './queries/GetQuery';
import GetManyQuery from './queries/GetManyQuery';

class Database {

  private connection: knex;

  constructor() {
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
    return statement.execute(this.connection);
  }

  get<T extends Model>(modelClass: ModelClass<T>, idOrProperties: string | Partial<T>): Promise<T> {
    return this.execute(new GetQuery(modelClass, idOrProperties));
  }

  getMany<T extends Model>(modelClass: ModelClass<T>, idsOrProperties: string[] | Partial<T>): Promise<T[]> {
    return this.execute(new GetManyQuery(modelClass, idsOrProperties));
  }

}

export default Database;
