import * as Boom from 'boom';
import { Handler, Request, Reply } from 'src/http/framework';
import { Coin } from 'src/db';
import { getCoinMetadata } from 'src/utils/cryptoCompare';

class SyncCoinDataHandler extends Handler {

  static route = 'post /_internal/sync';
  static auth = 'admin';

  handle(request: Request, reply: Reply) {
    this.database.getAll(Coin).then(existingCoins => {
      const promises = existingCoins.map(coin => this.updateCoin(coin));
      return Promise.all(promises).then(coins => {
        reply({ coins });
      });
    })
    .catch(error => {
      reply(Boom.internal(error));
    });
  }

  updateCoin(coin: Coin): Promise<Coin> {
    return getCoinMetadata(coin.ccid).then(data => {
      const match = { id: coin.id };
      const patch = {
        name: data.name,
        algorithm: data.algorithm,
        blocktime: data.blocktime,
        blockreward: data.blockreward,
        networkhashrate: data.networkhashrate
      };
      return this.database.update(Coin, match, patch);
    });
  }

}

export default SyncCoinDataHandler;
