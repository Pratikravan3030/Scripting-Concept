import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  createdDate: Date;
  lastChecked: Date | null;
  currentStreak: number;
  completions: Date[]; // History of completion dates
  failures: Date[]; // History of manually missed dates
  category: string;
}

const HabitSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  lastChecked: { type: Date, default: null },
  currentStreak: { type: Number, default: 0 },
  completions: [{ type: Date }],
  failures: [{ type: Date }],
  category: { type: String, default: 'General' }
}, {
  timestamps: true
});

export default mongoose.model<IHabit>('Habit', HabitSchema);
