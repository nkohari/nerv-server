import { Request, ReplyNoContinue } from 'hapi';
import { Keymaster } from 'src/common';
import { Database, MeasureStore } from 'src/db';

abstract class Handler {

  database: Database;
  keymaster: Keymaster;
  measureStore: MeasureStore;

  constructor(database: Database, keymaster: Keymaster, measureStore: MeasureStore) {
    this.database = database;
    this.keymaster = keymaster;
    this.measureStore = measureStore;
  }

  abstract handle(request: Request, reply: ReplyNoContinue): void;

}

export default Handler;
