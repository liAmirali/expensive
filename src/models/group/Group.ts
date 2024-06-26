import { Schema, Model, model, Document, Types } from "mongoose";
import { IOccasion, occasionSchema } from "./Occasion";
import { DebtsAndDemands } from "../../../types/expense";

export interface IGroup  {
  name: string;
  members: Types.ObjectId[];
  creator: Types.ObjectId;
  occasions: IOccasion[];
  createdAt: Date;
  updatedAt: Date;
  debtsAndDemands?: DebtsAndDemands;
}

export const groupSchema = new Schema<IGroup>(
  {
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
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    occasions: [occasionSchema],
  },
  {
    timestamps: true,
  }
);

export const Group: Model<IGroup> = model("Group", groupSchema);
