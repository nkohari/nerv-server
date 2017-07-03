import * as knex from 'knex';
import { Statement } from './Statement';
import Model from './Model';

interface ModelConstructor<T extends Model> {
  new(data?: any): T;
}

abstract class GetQuery<T extends Model> implements Statement<T> {

  modelType: ModelConstructor<T>;
  table: string;
  spec: object;

  constructor(modelType: ModelConstructor<T>, table: string, spec: object) {
    this.modelType = modelType;
    this.table = table;
    this.spec = spec;
  }

  execute(connection: knex): Promise<T> {
    return connection(this.table)
    .select('*')
    .where(this.spec)
    .then(data => new this.modelType(data[0]));
  }

}

export default GetQuery;
