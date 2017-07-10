import * as knex from 'knex';
import { MessageBus } from 'src/common';
import { Executor, Query, Statement } from 'src/db/framework';

class Transaction extends Executor {

  private transaction: knex;
  private messageBus: MessageBus;

  constructor(transaction: knex.Transaction, messageBus: MessageBus) {
    super();
    this.transaction = transaction;
    this.messageBus = messageBus;
  }

  query<T>(query: Query<T>): Promise<T> {
    return query.execute(this.transaction);
  }

  execute<T>(statement: Statement<T>): Promise<T> {
    return statement.execute(this.transaction, this.messageBus);
  }

}

export default Transaction;
