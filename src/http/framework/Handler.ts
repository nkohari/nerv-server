import { Database } from 'src/db';
import { Request, Reply } from 'src/http/framework';

abstract class Handler {

  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  abstract handle(request: Request, reply: Reply): void;

}

export default Handler;
