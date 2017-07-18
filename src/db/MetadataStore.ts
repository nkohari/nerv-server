import { MessageBus } from 'src/common';
import { Database, Coin, Currency, NetworkData, ExchangeRate } from 'src/db';

class MetadataStore {

  database: Database;
  messageBus: MessageBus;

  constructor(database: Database, messageBus: MessageBus) {
    this.database = database;
    this.messageBus = messageBus;
  }

  getCoins(): Promise<Coin[]> {
    const connection = this.database.getRawConnection();
    return connection('coins')
    .then(rows => rows.map(row => new Coin(row)));
  }

  getCurrencies(): Promise<Currency[]> {
    const connection = this.database.getRawConnection();
    return connection('currencies')
    .then(rows => rows.map(row => new Currency(row)));
  }

  hasCurrency(symbol: string): Promise<boolean> {
    const connection = this.database.getRawConnection();
    return connection('currencies')
    .count('*').as('count')
    .where({ symbol })
    .then(rows => rows && rows.length === 1 && rows[0].count === 1);
  }

  getCurrentNetworkData(symbol: string): Promise<NetworkData> {
    const connection = this.database.getRawConnection();
    return connection('networkdata')
    .where({ symbol })
    .orderBy('time', 'desc')
    .limit(1)
    .then(rows => (rows.length === 0) ? null : new NetworkData(rows[0]));
  }

  getCurrentExchangeRates(currency: string): Promise<ExchangeRate[]> {
    const connection = this.database.getRawConnection();
    return connection('exchangerates')
    .where({
      currency,
      time: connection.raw('(select max(time) from exchangerates where currency = ?)', currency)
    })
    .then(rows => rows.map(row => new ExchangeRate(row)));
  }

  addNetworkData(data: Partial<NetworkData>[]): Promise<NetworkData[]> {
    const connection = this.database.getRawConnection();
    return connection.transaction(transaction => {
      return Promise.all(
        data.map(item => (
          transaction('networkdata').insert(item)
          .returning('*')
          .then(rows => (rows.length === 0) ? null : new NetworkData(rows[0]))
        ))
      ).then(records => {
        this.messageBus.announceMetadata(records);
        return records;
      });
    });
  }

  addExchangeRates(data: Partial<ExchangeRate>[]): Promise<ExchangeRate[]> {
    const connection = this.database.getRawConnection();
    return connection.transaction(transaction => {
      return Promise.all(
        data.map(item => (
          transaction('exchangerates').insert(item)
          .returning('*')
          .then(rows => (rows.length === 0) ? null : new ExchangeRate(rows[0]))
        ))
      ).then(records => {
        this.messageBus.announceMetadata(records);
        return records;
      });
    });
  }

}

export default MetadataStore;
