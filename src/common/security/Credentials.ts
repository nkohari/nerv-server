import { Audience } from 'src/common';

class Credentials {

  userid: string;
  username: string;
  groups: string[];

  constructor(data: Partial<Credentials> = {}) {
    this.userid = data.userid;
    this.username = data.username;
    this.groups = data.groups || [];
  }

  isMemberOf(audience: Audience): boolean {
    if (audience.userid) {
      return this.userid === audience.userid;
    }
    if (audience.groupid) {
      return this.groups.indexOf(audience.groupid) !== -1;
    }
    return true;
  }

}

export default Credentials;
