abstract class Model {

  id: string;
  created: Date;

  constructor(data: any = {}) {
    for (let key in data) {
      this[key] = data[key];
    }
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
