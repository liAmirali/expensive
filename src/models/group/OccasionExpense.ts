import { model, Model, Schema } from "mongoose";

export const occasionExpenseSchema = new Schema<IOccasionExpense>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const OccasionExpense: Model<IOccasionExpense> = model(
  "OccasionExpense",
  occasionExpenseSchema
);
