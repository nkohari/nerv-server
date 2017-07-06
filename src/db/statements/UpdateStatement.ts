import * as knex from 'knex';
import { Model, ModelClass, Statement } from '../framework';

class UpdateStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  match: Partial<T>;
  patch: Partial<T>;

  constructor(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>) {
    this.modelClass = modelClass;
    this.match = match;
    this.patch = patch;
  }

  execute(connection: knex): Promise<T> {
    return connection(this.modelClass.table)
    .update(this.patch, '*')
    .where(<any> this.match)
    .then(rows => (rows.length === 0) ? null : new this.modelClass(rows[0]));
  }

}

export default UpdateStatement;
