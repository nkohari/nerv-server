import * as knex from 'knex';
import { MessageBus } from 'src/common';
import { Model, ModelClass, Statement } from 'src/db/framework';

class InsertStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  data: Partial<T>;

  constructor(modelClass: ModelClass<T>, data: Partial<T>) {
    this.modelClass = modelClass;
    this.data = data;
  }

  execute(connection: knex, messageBus: MessageBus): Promise<T> {
    return connection(this.modelClass.table).insert({
      created: new Date(),
      updated: new Date(),
      version: 1,
      ...(this.data as object)
    })
    .returning('*')
    .then(rows => {
      if (rows.length === 0) return null;
      const model = new this.modelClass(rows[0]);
      messageBus.announce('create', [model]);
      return model;
    });
  }

}

export default InsertStatement;
