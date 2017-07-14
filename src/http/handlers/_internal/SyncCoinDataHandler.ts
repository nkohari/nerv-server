import { Handler, Request, Reply } from 'src/http/framework';

class SyncCoinDataHandler extends Handler {

  static route = 'post /_internal/sync';
  static auth = 'admin';

  handle(request: Request, reply: Reply) {
    reply('ok');
  }

}

export default SyncCoinDataHandler;
