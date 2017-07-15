class Coin {

  symbol: string;
  ccid: string;

  constructor(data: Partial<Coin> = {}) {
    this.symbol = data.symbol;
    this.ccid = data.ccid;
  }

}

export default Coin;
