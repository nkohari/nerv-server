import { MutableModel } from 'src/db/framework';

class Membership extends MutableModel {

  static table = 'memberships';

  userid: string;
  groupid: string;

  constructor(data: Partial<Membership> = {}) {
    super(data);
    this.userid = data.userid;
    this.groupid = data.groupid;
  }

  getSecurityContext() {
    return { groupid: this.groupid };
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
