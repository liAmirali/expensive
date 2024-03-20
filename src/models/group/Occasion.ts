import { Schema, Types } from "mongoose";

export interface IOccasion {
  _id?: Types.ObjectId;
  name: string;
  members: Types.ObjectId[];
  expenses: Types.ObjectId[];
  debtsAndDemands?: DebtsAndDemands;
}

export const occasionSchema = new Schema<IOccasion>({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: "OccasionExpense",
    },
  ],
});
