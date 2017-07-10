import { Precondition } from 'src/http/framework';

export interface PreconditionClass {
  assign: string;
  new (...args: any[]): Precondition;
}
