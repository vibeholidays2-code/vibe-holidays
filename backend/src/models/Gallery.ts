import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  url: string;
  category: string;
  caption?: string;
  destination?: string;
  order: number;
  createdAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    caption: {
      type: String,
    },
    destination: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for category queries
GallerySchema.index({ category: 1, order: 1 });

export default mongoose.model<IGallery>('Gallery', GallerySchema);
