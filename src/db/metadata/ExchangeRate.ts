class ExchangeRate {

  id: string;
  time: Date;
  symbol: string;
  currency: string;
  amount: number;

  constructor(data: Partial<ExchangeRate> = {}) {
    this.id = data.id;
    this.time = data.time;
    this.symbol = data.symbol;
    this.currency = data.currency;
    this.amount = data.amount;
  }

  toJSON() {
    return {
      id: this.id,
      time: this.time.toISOString(),
      symbol: this.symbol,
      currency: this.currency,
      amount: this.amount
    };
  }

}

export default ExchangeRate;
