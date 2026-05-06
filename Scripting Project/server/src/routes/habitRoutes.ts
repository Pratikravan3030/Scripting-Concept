import { Router } from 'express';
import type { Response } from 'express';
import mongoose from 'mongoose';
import Habit from '../models/Habit.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { processHabitCompletion, calculateMissedDays, processMissedDays, processHabitFailure } from '../engine/habitEngine.js';

const router = Router();
router.use(authenticateToken);

// Get all habits and apply penalties for missed days automatically
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const habits = await Habit.find({ user: userId });
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let userUpdated = false;
    let currentUserPoints = user.totalPoints;
    const now = new Date();

    const isVacationActive = user.vacationMode?.isActive && 
      user.vacationMode.startDate && user.vacationMode.endDate &&
      now >= user.vacationMode.startDate && now <= user.vacationMode.endDate;

    for (let habit of habits) {
      if (habit.lastChecked) {
        const missedDays = calculateMissedDays(habit.lastChecked, now);
        if (missedDays > 0 && !isVacationActive) {
          const { newTotalPoints, newStreak } = processMissedDays(currentUserPoints, missedDays);
          
          if (newStreak !== -1) {
            habit.currentStreak = newStreak;
            await habit.save();
          }

          if (newTotalPoints !== currentUserPoints) {
            // Apply penalty to user points
            const penaltyAmount = currentUserPoints - newTotalPoints;
            currentUserPoints = newTotalPoints;
            user.pointHistory.push({
              date: now,
              points: -penaltyAmount // Log negative change
            });
            userUpdated = true;
          }
        }
      }
    }

    if (userUpdated) {
      user.totalPoints = currentUserPoints;
      await user.save();
    }

    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create a new habit
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Habit name is required' });
      return;
    }

    const newHabit = new Habit({
      user: req.user?.userId,
      name,
      category: category || 'General'
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Check-in a habit
router.post('/:id/checkin', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const habitId = req.params.id as string;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const now = new Date();
    
    // Check if already checked in today
    if (habit.lastChecked) {
      const last = new Date(habit.lastChecked);
      if (last.toDateString() === now.toDateString()) {
        res.status(400).json({ message: 'Already checked in today' });
        return;
      }
    }
    
    // Also check if already explicitly failed today
    if (habit.failures && habit.failures.length > 0) {
      const lastFailure = new Date(habit.failures[habit.failures.length - 1]!);
      if (lastFailure.toDateString() === now.toDateString()) {
         res.status(400).json({ message: 'Already marked as missed today' });
         return;
      }
    }

    // Engine calculation
    const { newTotalPoints, newStreak } = processHabitCompletion(user.totalPoints, habit.currentStreak);

    // Update User
    user.totalPoints = newTotalPoints;
    user.pointHistory.push({
      date: now,
      points: 10 // Positive change
    });
    
    // Check Milestones
    const milestonesList = [
      { threshold: 100, name: '100 Points Club' },
      { threshold: 500, name: '500 Points Club' },
      { threshold: 1000, name: '1000 Points Club' }
    ];
    milestonesList.forEach(m => {
      if (newTotalPoints >= m.threshold && !user.milestones.some(um => um.name === m.name)) {
        user.milestones.push({ name: m.name, achievedAt: now });
      }
    });

    await user.save();

    // Update Habit
    habit.currentStreak = newStreak;
    habit.lastChecked = now;
    habit.completions.push(now);
    await habit.save();

    res.json({ habit, userPoints: user.totalPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Explicitly mark habit as missed
router.post('/:id/missed', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const habitId = req.params.id as string;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const now = new Date();
    
    // Check if already checked in today
    if (habit.lastChecked) {
      const last = new Date(habit.lastChecked);
      if (last.toDateString() === now.toDateString()) {
        res.status(400).json({ message: 'Already checked in today' });
        return;
      }
    }

    // Check if already explicitly failed today
    if (habit.failures && habit.failures.length > 0) {
      const lastFailure = new Date(habit.failures[habit.failures.length - 1]!);
      if (lastFailure.toDateString() === now.toDateString()) {
         res.status(400).json({ message: 'Already marked as missed today' });
         return;
      }
    }

    // Engine calculation
    const { newTotalPoints, newStreak } = processHabitFailure(user.totalPoints);

    // Apply Penalty to User
    const penaltyAmount = user.totalPoints - newTotalPoints;
    user.totalPoints = newTotalPoints;
    
    if (penaltyAmount > 0) {
      user.pointHistory.push({
        date: now,
        points: -penaltyAmount // Negative change
      });
    }

    await user.save();

    // Update Habit
    habit.currentStreak = newStreak;
    if (!habit.failures) habit.failures = [];
    habit.failures.push(now);
    await habit.save();

    res.json({ habit, userPoints: user.totalPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a habit
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const habitId = req.params.id as string;

    const deleted = await Habit.findOneAndDelete({ _id: habitId, user: userId });
    if (!deleted) {
      res.status(404).json({ message: 'Habit not found' });
      return;
    }

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Weekly Report (Points over Time)
router.get('/report/weekly', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get last 7 days starting from today, midnight
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Create a map of the last 7 days initialized to 0 point changes
    const dailyPointsMap: { [date: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      dailyPointsMap[formatDate(d)] = 0; // YYYY-MM-DD in local time
    }

    // Aggregate points from history
    user.pointHistory.forEach(record => {
      if (record.date >= sevenDaysAgo) {
        const recordDate = new Date(record.date);
        const dateKey = formatDate(recordDate);
        if (dailyPointsMap[dateKey] !== undefined) {
          dailyPointsMap[dateKey] += record.points;
        }
      }
    });

    const dates = Object.keys(dailyPointsMap).sort();
    const pointChanges = dates.map(date => dailyPointsMap[date] || 0);

    // Construct cumulative points for chart
    let cumulative = user.totalPoints - pointChanges.reduce((a, b) => a + b, 0);
    const chartData = pointChanges.map(change => {
      cumulative += change;
      return Math.max(0, cumulative);
    });

    res.json({
      dates,
      points: chartData,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
