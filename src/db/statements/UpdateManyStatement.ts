import * as knex from 'knex';
import { Model, ModelClass, Statement } from '../framework';

class UpdateManyStatement<T extends Model> implements Statement<T[]> {

  modelClass: ModelClass<T>;
  match: Partial<T>;
  patch: Partial<T>;

  constructor(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>) {
    this.modelClass = modelClass;
    this.match = match;
    this.patch = patch;
  }

  execute(connection: knex): Promise<T[]> {
    return connection(this.modelClass.table)
    .update(this.patch, '*')
    .where(<any> this.match)
    .then(rows => rows.map(row => new this.modelClass(row)));
  }

}

export default UpdateManyStatement;
