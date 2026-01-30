import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  packageId?: mongoose.Types.ObjectId;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
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
    phone: {
      type: String,
      trim: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'read', 'responded'],
        message: '{VALUE} is not a valid status',
      },
      default: 'new',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for admin queries
InquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
