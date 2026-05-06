import { Router } from 'express';
import type { Response } from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// Get User Profile
router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update Settings
router.put('/settings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { vacationMode, theme } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (vacationMode !== undefined) {
      user.vacationMode = vacationMode;
    }
    if (theme !== undefined) {
      user.theme = theme;
    }

    await user.save();
    res.json({ message: 'Settings updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Leaderboard (Top 10 users)
router.get('/leaderboard', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topUsers = await User.find()
      .sort({ totalPoints: -1 })
      .limit(10)
      .select('username totalPoints milestones');
      
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
