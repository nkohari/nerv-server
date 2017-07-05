import * as uuid from 'uuid/v4';
import * as knex from 'knex';
import { Model, ModelClass, Statement } from '.';

class InsertStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  data: object;

  constructor(modelClass: ModelClass<T>, data: object) {
    this.modelClass = modelClass;
    this.data = data;
  }

  execute(connection: knex): Promise<T> {
    return connection(this.modelClass.table).insert({
      id: uuid(),
      created: new Date(),
      ...this.data
    })
    .returning('*')
    .then(rows => (rows.length === 0) ? null : new this.modelClass(rows[0]));
  }

}

export default InsertStatement;
