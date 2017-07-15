import { Audience } from 'src/common';

abstract class Model {

  id: string;
  created: Date;
  updated: Date;
  deleted: Date;
  version: number;

  constructor(data: Partial<Model>) {
    this.id = data.id;
    this.created = data.created;
    this.updated = data.updated;
    this.deleted = data.deleted;
    this.version = data.version;
  }

  abstract getAudience(): Audience;

  toJSON(): object {
    return {
      id: this.id,
      created: this.created.toISOString(),
      updated: this.updated.toISOString(),
      deleted: this.deleted ? this.deleted.toISOString() : undefined,
      version: this.version
    };
  }

}

export default Model;
