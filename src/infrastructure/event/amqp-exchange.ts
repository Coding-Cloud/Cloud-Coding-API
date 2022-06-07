export class AmqpExchange {
  constructor(private _exchangeMode: string, private _exchangeName: string) {}

  get exchangeMode(): string {
    return this._exchangeMode;
  }

  get exchangeName(): string {
    return this._exchangeName;
  }
}
