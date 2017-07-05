import * as knex from 'knex';
import { Model, ModelClass, Statement } from '../framework';

class GetManyQuery<T extends Model> implements Statement<T[]> {

  modelClass: ModelClass<T>;
  idsOrProperties: string[] | Partial<T>;

  constructor(modelClass: ModelClass<T>, idsOrProperties: string[] | Partial<T>) {
    this.modelClass = modelClass;
    this.idsOrProperties = idsOrProperties;
  }

  execute(connection: knex): Promise<T[]> {
    const query = connection(this.modelClass.table).select('*');

    if (Array.isArray(this.idsOrProperties)) {
      query.whereIn('id', this.idsOrProperties);
    } else {
      query.where(<any> this.idsOrProperties);
    }

    return query.then(rows => rows.map(row => new this.modelClass(row)));
  }

}

export default GetManyQuery;
