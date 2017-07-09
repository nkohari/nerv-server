import Precondition from './Precondition';

export interface PreconditionClass {
  assign: string;
  new (...args: any[]): Precondition;
}
