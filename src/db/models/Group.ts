import { MutableModel } from 'src/db/framework';

class Group extends MutableModel {

  static table = 'groups';

  name: string;

  constructor(data: Partial<Group> = {}) {
    super(data);
    this.name = data.name;
  }

  getSecurityContext() {
    return { groupid: this.id };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name
    };
  }

}

export default Group;
