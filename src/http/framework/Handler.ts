import { Request, ReplyNoContinue } from 'hapi';
import { Database } from '../../db';
import Keymaster from '../services/Keymaster';

abstract class Handler {

  protected database: Database;
  protected keymaster: Keymaster;

  constructor(database: Database, keymaster: Keymaster) {
    this.database = database;
    this.keymaster = keymaster;
  }

  abstract handle(request: Request, reply: ReplyNoContinue): void;

}

export default Handler;
