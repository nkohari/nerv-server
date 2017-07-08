class Message {

  sender: string;
  groupid: string;
  body: any;

  constructor(data: Partial<Message> = {}) {
    this.sender = data.sender;
    this.groupid = data.groupid;
    this.body = data.body;
  }

}

export default Message;
