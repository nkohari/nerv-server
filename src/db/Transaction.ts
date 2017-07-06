import * as knex from 'knex';
import { Executor, Statement } from './framework';

class Transaction extends Executor {

  private transaction: knex;

  constructor(transaction: knex.Transaction) {
    super();
    this.transaction = transaction;
  }

  execute<T>(statement: Statement<T>): Promise<T> {
    return statement.execute(this.transaction);
  }

}

export default Transaction;
