import axios from 'axios';

const FULL_API_URL = 'https://www.cryptocompare.com/api/data';
const MIN_API_URL = 'https://min-api.cryptocompare.com/data';

type CoinDefinition = {
  ccid: string;
  symbol: string;
  name: string;
};

type CoinMetadata = {
  ccid: string;
  symbol: string;
  name: string;
  algorithm: string;
  blocktime: number;
  blockreward: number;
  networkhashrate: number;
};

type CoinExchangeRate = {
  symbol: string;
  currency: string;
  rate: number;
};

export function getCoinList(): Promise<CoinDefinition[]> {
  return axios.get(`${FULL_API_URL}/coinlist`)
  .then(response => response.data.Data)
  .then(coinMap => {
    return Object.keys(coinMap).map(symbol => ({
      ccid: coinMap[symbol].Id,
      symbol,
      name: coinMap[symbol].CoinName.replace(/\s+/, '')
    }));
  });
}

export function getCoinMetadata(ccid: string): Promise<CoinMetadata> {
  return axios.get(`${FULL_API_URL}/coinsnapshotfullbyid?id=${ccid}`)
  .then(response => response.data.Data.General)
  .then(data => ({
    ccid,
    symbol: data.Symbol.toUpperCase(),
    name: data.Name.replace(/\s+/, ''),
    algorithm: data.Algorithm.toLowerCase(),
    blocktime: data.BlockTime,
    blockreward: data.BlockReward,
    networkhashrate: Math.round(data.NetHashesPerSecond)
  }));
}

export function getExchangeRates(symbols: string[], currencies: string[]): Promise<CoinExchangeRate[]> {
  const params = {
    fsyms: symbols.join(','),
    tsyms: currencies.join(',')
  };
  return axios.get(`${MIN_API_URL}/pricemulti`, { params }).then(response => {
    const rateMap = response.data;
    const results = [];

    Object.keys(rateMap).forEach(symbol => {
      Object.keys(rateMap[symbol]).forEach(currency => {
        results.push({
          symbol,
          currency,
          rate: rateMap[symbol][currency]
        });
      });
    });

    return results;
  });
}
