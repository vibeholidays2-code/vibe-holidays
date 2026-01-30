import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  thumbnail?: string;
  brochureUrl?: string;
  featured: boolean;
  active: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    itinerary: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
    },
    brochureUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
PackageSchema.index({ destination: 1, price: 1 });
PackageSchema.index({ featured: 1, active: 1 });

export default mongoose.model<IPackage>('Package', PackageSchema);
