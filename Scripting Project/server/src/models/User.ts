import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  totalPoints: number;
  pointHistory: { date: Date; points: number }[];
  vacationMode: {
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
  };
  theme: string;
  milestones: { name: string; achievedAt: Date }[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  pointHistory: [{
    date: { type: Date, default: Date.now },
    points: { type: Number, required: true }
  }],
  vacationMode: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }
  },
  theme: { type: String, default: 'dark' },
  milestones: [{
    name: { type: String, required: true },
    achievedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
