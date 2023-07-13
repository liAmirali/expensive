export class Expense {
  constructor(
    private value: number,
    private currency: string,
    private category: string,
    private description: string
  ) {}
}
