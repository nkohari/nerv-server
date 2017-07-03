import { Request, ReplyNoContinue } from 'hapi';
import { Database } from '../db';

abstract class Handler {

  protected database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  abstract handle(request: Request, reply: ReplyNoContinue): void;

}

export default Handler;
