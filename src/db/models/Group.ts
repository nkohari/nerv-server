import { Model } from '../framework';

class Group extends Model {

  static table = 'groups';

  name: string;

  constructor(data: Partial<Group> = {}) {
    super(data);
    this.name = data.name;
  }

  serialize() {
    return {
      name: this.name
    };
  }

}

export default Group;
