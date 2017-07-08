import { Request, ReplyNoContinue } from 'hapi';
import { Database } from '../../db';
import { Keymaster } from '../../common';

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
