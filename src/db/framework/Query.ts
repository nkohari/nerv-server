import * as knex from 'knex';

export interface Query<T> {
  execute(connection: knex): Promise<T>;
}
