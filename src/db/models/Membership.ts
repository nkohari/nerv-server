import { Audience } from 'src/common';
import { Model } from 'src/db/framework';

class Membership extends Model {

  static table = 'memberships';

  userid: string;
  groupid: string;

  constructor(data: Partial<Membership> = {}) {
    super(data);
    this.userid = data.userid;
    this.groupid = data.groupid;
  }

  getAudience() {
    return new Audience({ groupid: this.groupid });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userid: this.userid,
      groupid: this.groupid
    };
  }

}

export default Membership;
