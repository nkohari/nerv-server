class Audience {

  static PUBLIC = new Audience();

  userid: string;
  groupid: string;

  constructor(data: Partial<Audience> = {}) {
    this.userid = data.userid;
    this.groupid = data.groupid;
  }

  toString() {
    if (this.userid && this.groupid) {
      return `<user ${this.userid} in group ${this.groupid}>`;
    }
    if (this.userid) {
      return `<user ${this.userid}>`;
    }
    if (this.groupid) {
      return `<group ${this.groupid}>`;
    }
    return '<public>';
  }

}

export default Audience;
