import { Request, ReplyWithContinue } from 'hapi';
import { Database } from '../../db';

abstract class Precondition {

  protected database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  abstract execute(request: Request, reply: ReplyWithContinue): void;

}

export default Precondition;
