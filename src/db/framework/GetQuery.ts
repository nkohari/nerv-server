import * as knex from 'knex';
import { Statement } from './Statement';
import Model from './Model';
import { ModelClass } from './ModelClass';

abstract class GetQuery<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  spec: object;

  constructor(modelClass: ModelClass<T>, spec: object) {
    this.modelClass = modelClass;
    this.spec = spec;
  }

  execute(connection: knex): Promise<T> {
    return connection(this.modelClass.table)
    .select('*')
    .where(this.spec)
    .then(rows => (rows.length === 0) ? null : new this.modelClass(rows[0]));
  }

}

export default GetQuery;
