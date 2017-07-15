import { Audience } from 'src/common';

class Message {

  sender: string;
  audience: Audience;
  body: any;

  constructor(data: Partial<Message> = {}) {
    this.sender = data.sender;
    this.audience = new Audience(data.audience);
    this.body = data.body;
  }

}

export default Message;
