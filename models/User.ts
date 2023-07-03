import { Expense } from "./Expense";

const users: User[] = [];

export class User {
  private name: string;
  private email: string;
  private password: string;
  private profilePicture: File | null;

  private expenses: Expense[];

  constructor(
    name: string,
    email: string,
    password: string,
    profilePicture: File | null = null
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;

    this.expenses = [];
  }

  addExpense(expense: Expense) {
    this.expenses.push(expense);
  }

  save() {
    users.push(this);
  }

  getAll() {
    return users;
  }
}
