class Currency {

  symbol: string;

  constructor(data: Partial<Currency> = {}) {
    this.symbol = data.symbol;
  }

}

export default Currency;
