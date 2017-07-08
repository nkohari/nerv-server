import { Model } from '../framework';

class Membership extends Model {

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

  serialize() {
    return {
      userid: this.userid,
      groupid: this.groupid
    };
  }

}

export default Membership;
