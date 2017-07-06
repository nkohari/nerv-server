import * as uuid from 'uuid/v4';
import * as knex from 'knex';
import { Model, ModelClass, Statement } from '../framework';

class InsertStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  properties: Partial<T>;

  constructor(modelClass: ModelClass<T>, properties: Partial<T>) {
    this.modelClass = modelClass;
    this.properties = properties;
  }

  execute(connection: knex): Promise<T> {
    return connection(this.modelClass.table).insert({
      id: uuid(),
      created: new Date(),
      ...(this.properties as object)
    })
    .returning('*')
    .then(rows => (rows.length === 0) ? null : new this.modelClass(rows[0]));
  }

}

export default InsertStatement;
