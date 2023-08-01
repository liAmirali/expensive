import { Model, Schema, model } from "mongoose";
import { IOccasionExpense, OccasionExpense } from "./OccasionExpense";
import { IUser, User } from "../User";

export interface IOccasion {
  name: string;
  members: IUser[];
  expenses: IOccasionExpense[];
}

const occasionSchema = new Schema<IOccasion>({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: User,
      required: true,
    },
  ],
  expenses: [
    {
      type: OccasionExpense,
    },
  ],
});

export const Occasion: Model<IOccasion> = model("Occasion", occasionSchema);
