import * as knex from 'knex';
import { MessageBus } from 'src/common';
import { Model, ModelClass, Statement } from 'src/db/framework';

class UpdateManyStatement<T extends Model> implements Statement<T[]> {

  modelClass: ModelClass<T>;
  match: Partial<T>;
  patch: Partial<T>;

  constructor(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>) {
    this.modelClass = modelClass;
    this.match = match;
    this.patch = patch;
  }

  execute(connection: knex, messageBus: MessageBus): Promise<T[]> {
    return connection(this.modelClass.table)
    .update({
      version: connection.raw('version + 1'),
      ...(this.patch as object)
    })
    .returning('*')
    .where(this.match as object)
    .then(rows => {
      if (rows.length === 0) return [];
      const models = rows.map(row => new this.modelClass(row));
      messageBus.announce('update', models);
      return models;
    });
  }

}

export default UpdateManyStatement;
