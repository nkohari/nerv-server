import Model from './Model';

export interface ModelClass<T extends Model> {
  table: string;
  new(data?: any): T;
}
