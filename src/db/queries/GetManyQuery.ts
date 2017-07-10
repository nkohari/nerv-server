import * as knex from 'knex';
import { GetManyProperties, Model, ModelClass, Query } from 'src/db/framework';

class GetManyQuery<T extends Model> implements Query<T[]> {

  modelClass: ModelClass<T>;
  properties: GetManyProperties<T>;

  constructor(modelClass: ModelClass<T>, properties: GetManyProperties<T>) {
    this.modelClass = modelClass;
    this.properties = properties;
  }

  execute(connection: knex): Promise<T[]> {
    const query = connection(this.modelClass.table).select('*');

    for (let key in this.properties) {
      const value = this.properties[key];
      if (Array.isArray(value)) {
        query.whereIn(key, value);
      } else {
        query.where(key, value);
      }
    }

    return query.then(rows => rows.map(row => new this.modelClass(row)));
  }

}

export default GetManyQuery;
