import { SecurityContext } from 'src/common';

abstract class Model {

  id: string;
  created: Date;

  constructor(data: Partial<Model>) {
    this.id = data.id;
    this.created = data.created;
  }

  abstract getSecurityContext(): SecurityContext;

  toJSON(): object {
    return {
      id: this.id,
      created: this.created.toISOString()
    };
  }

}

export default Model;
