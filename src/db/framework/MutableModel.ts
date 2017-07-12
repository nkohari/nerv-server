import Model from './Model';

abstract class MutableModel extends Model {

  updated: Date;
  deleted: Date;
  version: number;

  constructor(data: Partial<MutableModel>) {
    super(data);
    this.updated = data.updated;
    this.deleted = data.deleted;
    this.version = data.version;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      updated: this.updated.toISOString(),
      deleted: this.deleted ? this.deleted.toISOString() : undefined,
      version: this.version
    };
  }

}

export default MutableModel;
