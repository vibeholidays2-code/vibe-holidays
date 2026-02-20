import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    name: string;
    email: string;
    rating: number;
    comment: string;
    destination?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        destination: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'rejected'],
                message: '{VALUE} is not a valid status',
            },
            default: 'pending',
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
