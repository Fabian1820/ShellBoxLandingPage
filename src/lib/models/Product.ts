import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string;
  sizes?: string[];
  colors?: Array<{
    name: string;
    hex: string;
  }>;
  images: string[];
  featured: boolean;
  new: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [
        {
          name: String,
          hex: String,
        },
      ],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
