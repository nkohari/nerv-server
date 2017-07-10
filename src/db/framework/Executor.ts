import { GetQuery, GetManyQuery, InsertStatement, UpdateStatement, UpdateManyStatement } from 'src/db';
import { GetManyProperties, Model, ModelClass, Query, Statement } from 'src/db/framework';

abstract class Executor {

  abstract query<T>(query: Query<T>): Promise<T>;
  abstract execute<T>(statement: Statement<T>): Promise<T>;

  get<T extends Model>(modelClass: ModelClass<T>, idOrProperties: string | Partial<T>): Promise<T> {
    return this.query(new GetQuery(modelClass, idOrProperties));
  }

  getMany<T extends Model>(modelClass: ModelClass<T>, properties: GetManyProperties<T>): Promise<T[]> {
    return this.query(new GetManyQuery(modelClass, properties));
  }

  insert<T extends Model>(modelClass: ModelClass<T>, properties: Partial<T>): Promise<T> {
    return this.execute(new InsertStatement(modelClass, properties));
  }

  insertMany<T extends Model>(modelClass: ModelClass<T>, properties: Partial<T>[]): Promise<T[]> {
    return Promise.all(properties.map(p => this.insert(modelClass, p)));
  }

  update<T extends Model>(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>): Promise<T> {
    return this.execute(new UpdateStatement(modelClass, match, patch));
  }

  updateMany<T extends Model>(modelClass: ModelClass<T>, match: Partial<T>, patch: Partial<T>): Promise<T[]> {
    return this.execute(new UpdateManyStatement(modelClass, match, patch));
  }

}

export default Executor;
