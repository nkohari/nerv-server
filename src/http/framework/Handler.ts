import { Keymaster } from 'src/common';
import { Database, MeasureStore } from 'src/db';
import { Request, Reply } from 'src/http/framework';

abstract class Handler {

  database: Database;
  keymaster: Keymaster;
  measureStore: MeasureStore;

  constructor(database: Database, keymaster: Keymaster, measureStore: MeasureStore) {
    this.database = database;
    this.keymaster = keymaster;
    this.measureStore = measureStore;
  }

  abstract handle(request: Request, reply: Reply): void;

}

export default Handler;
