import * as knex from 'knex';
import { MessageBus } from '../common';
import { Executor, Statement } from './framework';

class Transaction extends Executor {

  private transaction: knex;
  private messageBus: MessageBus;

  constructor(transaction: knex.Transaction, messageBus: MessageBus) {
    super();
    this.transaction = transaction;
  }

  execute<T>(statement: Statement<T>): Promise<T> {
    return statement.execute(this.transaction, this.messageBus);
  }

}

export default Transaction;
