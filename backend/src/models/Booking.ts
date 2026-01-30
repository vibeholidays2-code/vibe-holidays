import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  packageId: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  travelDate: Date;
  numberOfTravelers: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package ID is required'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
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
      required: [true, 'Phone number is required'],
      trim: true,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Travel date must be in the future',
      },
    },
    numberOfTravelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'Number of travelers must be at least 1'],
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for admin queries
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ packageId: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
