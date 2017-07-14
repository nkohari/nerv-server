import * as knex from 'knex';
import { Model, ModelClass, Query } from 'src/db/framework';

class GetAllQuery<T extends Model> implements Query<T[]> {

  modelClass: ModelClass<T>;

  constructor(modelClass: ModelClass<T>) {
    this.modelClass = modelClass;
  }

  execute(connection: knex): Promise<T[]> {
    return connection(this.modelClass.table)
    .select('*')
    .then(rows => rows.map(row => new this.modelClass(row)));
  }

}

export default GetAllQuery;
