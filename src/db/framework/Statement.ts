import * as knex from 'knex';

export interface Statement<T> {
  execute(connection: knex): Promise<T>;
}
