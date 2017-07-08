class Credentials {

  userid: string;
  username: string;
  groups: string[];

  constructor(data: Partial<Credentials> = {}) {
    this.userid = data.userid;
    this.username = data.username;
    this.groups = data.groups || [];
  }

  canAccess(groupid: string): boolean {
    return this.groups.indexOf(groupid) !== -1;
  }

}

export default Credentials;
