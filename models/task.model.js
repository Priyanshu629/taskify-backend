import { Schema, model, Types } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    dueDate: {
      type: Date,
      require: true,
    },
    priority: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    userEmail: {
      type: String,
      require:true,
    },
    userId: {
      type: Types.ObjectId,
      ref:"user"
    },
    assignedTo: {
      type: String,
      default : null
    },
  },
  {
    timestamps: true,
  }
);
export const TaskModel = new model("task", TaskSchema);
