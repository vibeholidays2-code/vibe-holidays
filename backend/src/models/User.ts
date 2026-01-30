import mongoose, { Schema, Document } from 'mongoose';
import { hashPassword } from '../utils/auth';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Note: Indexes are automatically created by unique: true on username and email fields

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Type assertion since we know password is a string at this point
    this.password = await hashPassword(this.password as string);
    next();
  } catch (error: any) {
    next(error);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
