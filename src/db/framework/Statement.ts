import * as knex from 'knex';
import { MessageBus } from 'src/common';

export interface Statement<T> {
  execute(connection: knex, messageBus: MessageBus): Promise<T>;
}
