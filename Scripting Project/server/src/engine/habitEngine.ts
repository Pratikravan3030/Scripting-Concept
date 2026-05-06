export interface PointResult {
  newTotalPoints: number;
  newStreak: number;
}

/**
 * Processes a successful habit completion.
 * @param currentPoints The user's current total points
 * @param currentStreak The habit's current streak
 * @returns The new total points and updated streak
 */
export const processHabitCompletion = (currentPoints: number, currentStreak: number): PointResult => {
  return {
    newTotalPoints: currentPoints + 10,
    newStreak: currentStreak + 1
  };
};

/**
 * Calculates how many days were missed since the last check-in.
 * @param lastChecked The date the habit was last completed/checked
 * @param currentDate The current date for comparison
 * @returns Number of calendar days missed
 */
export const calculateMissedDays = (lastChecked: Date | null, currentDate: Date): number => {
  if (!lastChecked) return 0;
  
  const last = new Date(lastChecked);
  last.setHours(0, 0, 0, 0);
  
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If diffDays is 1, it means they checked in yesterday, so 0 missed days.
  // If diffDays is > 1, the days missed is diffDays - 1.
  return diffDays > 1 ? diffDays - 1 : 0;
};

/**
 * Processes the penalty for missed days.
 * @param currentPoints The user's current total points
 * @param missedDays The number of days missed
 * @returns The new total points (floored at 0) and the reset streak (0)
 */
export const processMissedDays = (currentPoints: number, missedDays: number): PointResult => {
  if (missedDays <= 0) {
    return { newTotalPoints: currentPoints, newStreak: -1 }; // -1 indicates no change needed to streak
  }
  
  const penalty = missedDays * 5;
  const newPoints = Math.max(0, currentPoints - penalty); // Point Floor: cannot go below 0
  
  return {
    newTotalPoints: newPoints,
    newStreak: 0 // Reset streak to 0
  };
};

/**
 * Processes an explicit habit failure (user clicked "Not Done").
 * @param currentPoints The user's current total points
 * @returns The new total points (floored at 0) and the reset streak (0)
 */
export const processHabitFailure = (currentPoints: number): PointResult => {
  const penalty = 5; // Standard penalty for a single missed day
  const newPoints = Math.max(0, currentPoints - penalty);
  
  return {
    newTotalPoints: newPoints,
    newStreak: 0
  };
};
