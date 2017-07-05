abstract class Model {

  id: string;
  created: Date;

  constructor(data: Partial<Model>) {
    this.id = data.id;
    this.created = data.created;
  }

  abstract serialize(): object;

  toJSON(): object {
    return {
      id: this.id,
      created: this.created.toISOString(),
      ...this.serialize()
    };
  }

}

export default Model;
