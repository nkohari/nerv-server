import { Database } from 'src/db';
import { Request } from './Request';
import { Reply } from './Reply';

abstract class Precondition {

  protected database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  abstract execute(request: Request, reply: Reply): void;

}

export default Precondition;
