import { Schema, Types } from "mongoose";
import { IOccasionExpense, occasionExpenseSchema } from "./OccasionExpense";

export interface IOccasion {
  _id?: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  expenses?: IOccasionExpense[];
}

export const occasionSchema = new Schema<IOccasion>({
  name: {
    type: String,
    required: true,
  },
  members: [Schema.Types.ObjectId],
  expenses: [occasionExpenseSchema],
});
