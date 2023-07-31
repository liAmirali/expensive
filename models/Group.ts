import { Schema, Model, model, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  members: Schema.Types.ObjectId[];
  creator: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
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
  },
  {
    timestamps: true,
  }
);

export const groupModel: Model<IGroup> = model("Group", groupSchema);
