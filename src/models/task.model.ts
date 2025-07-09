import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: Date;
  projectId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, trim : true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: Date },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);