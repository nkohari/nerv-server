import * as knex from 'knex';
import { MessageBus } from '../../common';

export interface Statement<T> {
  execute(connection: knex, messageBus: MessageBus): Promise<T>;
}
