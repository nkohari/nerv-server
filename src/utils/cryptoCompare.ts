import axios from 'axios';
import { Coin, Currency, ExchangeRate, NetworkData } from 'src/db';

const FULL_API_URL = 'https://www.cryptocompare.com/api/data';
const MIN_API_URL = 'https://min-api.cryptocompare.com/data';

export function getNetworkData(ccid: string): Promise<Partial<NetworkData>> {
  return axios.get(`${FULL_API_URL}/coinsnapshotfullbyid?id=${ccid}`)
  .then(response => response.data.Data.General)
  .then(data => ({
    symbol: data.Symbol.toUpperCase(),
    algorithm: data.Algorithm.toLowerCase(),
    blocktime: data.BlockTime,
    blockreward: data.BlockReward,
    networkhashrate: Math.round(data.NetHashesPerSecond)
  }));
}

export function getExchangeRates(coins: Coin[], currencies: Currency[]): Promise<Partial<ExchangeRate>[]> {
  const params = {
    fsyms: coins.map(coin => coin.symbol).join(','),
    tsyms: currencies.map(currency => currency.symbol).join(',')
  };
  return axios.get(`${MIN_API_URL}/pricemulti`, { params }).then(response => {
    const rateMap = response.data;
    const results = [];

    Object.keys(rateMap).forEach(symbol => {
      Object.keys(rateMap[symbol]).forEach(currency => {
        results.push({
          symbol,
          currency,
          amount: rateMap[symbol][currency]
        });
      });
    });

    return results;
  });
}
