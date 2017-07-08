import { SecurityContext } from '../../common';

abstract class Model {

  id: string;
  created: Date;
  version: number;

  constructor(data: Partial<Model>) {
    this.id = data.id;
    this.created = data.created;
    this.version = data.version;
  }

  abstract getSecurityContext(): SecurityContext;
  abstract serialize(): object;

  toJSON(): object {
    return {
      id: this.id,
      created: this.created.toISOString(),
      version: this.version,
      ...this.serialize()
    };
  }

}

export default Model;
