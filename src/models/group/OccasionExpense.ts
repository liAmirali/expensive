import { Model, Schema, model } from "mongoose";
import { IUser, User } from "../User";

export interface IOccasionExpense {
  value: number;
  paidBy: IUser;
  assignedTo: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

const occasionExpenseSchema = new Schema<IOccasionExpense>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    paidBy: {
      type: User,
      required: true,
    },
    assignedTo: [
      {
        type: User,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const OccasionExpense: Model<IOccasionExpense> = model("OccasionExpense", occasionExpenseSchema);
