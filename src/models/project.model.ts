import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
    name: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema : Schema<IProject> = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        trim: true
    }
},{timestamps: true});

export const Project = mongoose.model<IProject>('Project', projectSchema);