import * as uuid from 'uuid/v4';
import * as knex from 'knex';
import { MessageBus } from '../../common';
import { Model, ModelClass, Statement } from '../framework';

class InsertStatement<T extends Model> implements Statement<T> {

  modelClass: ModelClass<T>;
  properties: Partial<T>;

  constructor(modelClass: ModelClass<T>, properties: Partial<T>) {
    this.modelClass = modelClass;
    this.properties = properties;
  }

  execute(connection: knex, messageBus: MessageBus): Promise<T> {
    return connection(this.modelClass.table).insert({
      id: uuid(),
      created: new Date(),
      version: 1,
      ...(this.properties as object)
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
