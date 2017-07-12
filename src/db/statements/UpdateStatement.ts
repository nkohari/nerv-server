import * as knex from 'knex';
import { MessageBus } from 'src/common';
import { MutableModel, ModelClass, Statement } from 'src/db/framework';

class UpdateStatement<T extends MutableModel> implements Statement<T> {

  modelClass: ModelClass<T>;
  match: Partial<T>;
  patch: Partial<T>;

  constructor(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>) {
    this.modelClass = modelClass;
    this.match = match;
    this.patch = patch;
  }

  execute(connection: knex, messageBus: MessageBus): Promise<T> {
    return connection(this.modelClass.table)
    .update({
      updated: new Date(),
      version: connection.raw('version + 1'),
      ...(this.patch as object)
    })
    .returning('*')
    .where(this.match as object)
    .then(rows => {
      if (rows.length === 0) return null;
      const model = new this.modelClass(rows[0]);
      messageBus.announce('update', [model]);
      return model;
    });
  }

}

export default UpdateStatement;
