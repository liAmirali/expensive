export class Expense {
  private value: number;
  private currency: string;
  private description: string;
  private category: string;

  constructor(value: number, currency: string, category: string, description: string) {
    this.value = value;
    this.currency = currency;
    this.category = category;
    this.description = description;
  }
}
