import { Request, ReplyNoContinue } from 'hapi';
import { Keymaster } from 'src/common';
import { Database } from 'src/db';

abstract class Handler {

  database: Database;
  keymaster: Keymaster;

  constructor(database: Database, keymaster: Keymaster) {
    this.database = database;
    this.keymaster = keymaster;
  }

  abstract handle(request: Request, reply: ReplyNoContinue): void;

}

export default Handler;
