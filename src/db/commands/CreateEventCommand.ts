import Event from '../models/Event';
import InsertStatement from '../framework/InsertStatement';

class CreateEventCommand extends InsertStatement<Event> {

  constructor(userid: string, agentid: string, deviceid: string, properties: object) {
    super(Event, { userid, agentid, deviceid, properties });
  }

}

export default CreateEventCommand;
