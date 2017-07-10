import { Transaction } from 'src/db';

export interface Command<T> {
  run(transaction: Transaction): Promise<T>;
}
