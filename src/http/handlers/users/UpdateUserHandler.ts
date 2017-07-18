import * as Joi from 'joi';
import { CheckCurrency } from 'src/http/preconditions';
import { Handler, Request, Reply } from 'src/http/framework';
import { User, Database, MetadataStore } from 'src/db';

class UpdateUserHandler extends Handler {

  static routes = 'put /users/{userid}';

  static pre = [
    CheckCurrency
  ];

  static validate = {
    payload: {
      email: Joi.string().email(),
      currency: Joi.string()
    }
  };

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  handle(request: Request, reply: Reply) {
    const match = { id: request.auth.credentials.userid };
    const patch = request.payload as Partial<User>;
    this.database.update(User, match, patch).then(user => {
      reply({ user });
    });
  }

  checkCurrency(currency: string): Promise<boolean> {
    return currency ? this.metadataStore.hasCurrency(currency) : Promise.resolve(true);
  }

}

export default UpdateUserHandler;
