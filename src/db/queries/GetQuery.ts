import * as knex from 'knex';
import { Model, ModelClass, Query } from 'src/db/framework';

class GetQuery<T extends Model> implements Query<T> {

  modelClass: ModelClass<T>;
  idOrProperties: string | Partial<T>;

  constructor(modelClass: ModelClass<T>, idOrProperties: string | Partial<T>) {
    this.modelClass = modelClass;
    this.idOrProperties = idOrProperties;
  }

  execute(connection: knex): Promise<T> {
    const query = connection(this.modelClass.table).select('*');

    if (typeof this.idOrProperties === 'string') {
      query.where({ id: this.idOrProperties });
    } else {
      query.where(<any> this.idOrProperties);
    }

    return query.then(rows => (rows.length === 0) ? null : new this.modelClass(rows[0]));
  }

}

export default GetQuery;
