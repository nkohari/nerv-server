import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { CreateDeviceCommand, Device } from 'src/db';

class CreateDeviceHandler extends Handler {

  static route = 'post /groups/{groupid}/agents/{agentid}/devices';

  static validate = {
    payload: {
      type: Joi.string().allow('cpu', 'gpu').required(),
      vendor: Joi.string().required(),
      model: Joi.string().required()
    }
  };

  handle(request: Request<Partial<Device>>, reply: Reply) {
    const { groupid, agentid } = request.params;
    const { type, vendor, model } = request.payload;

    const command = new CreateDeviceCommand({
      groupid,
      agentid,
      type,
      vendor,
      model
    });

    this.database.run(command).then(result => {
      const { device } = result;
      reply({ device }).code(201);
    });
  }

}

export default CreateDeviceHandler;
