import { Transaction } from '..';

export interface Command<T> {
  run(transaction: Transaction): Promise<T>;
}
