import { Model, Schema, model } from "mongoose";
import { IUser, User, userSchema } from "../User";

export interface IOccasionExpense {
  value: number;
  paidBy: IUser;
  assignedTo: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export const occasionExpenseSchema = new Schema<IOccasionExpense>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    paidBy: {
      type: userSchema,
      required: true,
    },
    assignedTo: [userSchema],
  },
  {
    timestamps: true,
  }
);
