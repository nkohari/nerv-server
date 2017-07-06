import { Model, ModelClass, Statement } from '.';
import { GetQuery, GetManyQuery, InsertStatement, UpdateStatement, UpdateManyStatement } from '../statements';

abstract class Executor {

  abstract execute<T>(statement: Statement<T>): Promise<T>;

  get<T extends Model>(modelClass: ModelClass<T>, idOrProperties: string | Partial<T>): Promise<T> {
    return this.execute(new GetQuery(modelClass, idOrProperties));
  }

  getMany<T extends Model>(modelClass: ModelClass<T>, idsOrProperties: string[] | Partial<T>): Promise<T[]> {
    return this.execute(new GetManyQuery(modelClass, idsOrProperties));
  }

  insert<T extends Model>(modelClass: ModelClass<T>, properties: Partial<T>): Promise<T> {
    return this.execute(new InsertStatement(modelClass, properties));
  }

  update<T extends Model>(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>): Promise<T> {
    return this.execute(new UpdateStatement(modelClass, match, patch));
  }

  updateMany<T extends Model>(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>): Promise<T[]> {
    return this.execute(new UpdateManyStatement(modelClass, match, patch));
  }

}

export default Executor;
