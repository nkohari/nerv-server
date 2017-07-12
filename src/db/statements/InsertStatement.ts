import * as uuid from 'uuid/v4';
import * as knex from 'knex';
import { MessageBus } from 'src/common';
import { Model, ModelClass, Statement } from 'src/db/framework';

class InsertStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  properties: Partial<T>;

  constructor(modelClass: ModelClass<T>, properties: Partial<T>) {
    this.modelClass = modelClass;
    this.properties = properties;
  }

  execute(connection: knex, messageBus: MessageBus): Promise<T> {
    console.log(this.properties);
    return connection(this.modelClass.table).insert({
      id: uuid(),
      ...(this.properties as any)
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
