import { processHabitCompletion, calculateMissedDays, processMissedDays } from './habitEngine.js';

console.log('--- Testing calculateMissedDays ---');
const today = new Date('2026-04-27T12:00:00Z');
console.log('Check-in today:', calculateMissedDays(new Date('2026-04-27T08:00:00Z'), today) === 0 ? 'PASS' : 'FAIL');
console.log('Check-in yesterday:', calculateMissedDays(new Date('2026-04-26T08:00:00Z'), today) === 0 ? 'PASS' : 'FAIL');
console.log('Check-in 2 days ago:', calculateMissedDays(new Date('2026-04-25T08:00:00Z'), today) === 1 ? 'PASS' : 'FAIL');
console.log('Check-in 5 days ago:', calculateMissedDays(new Date('2026-04-22T08:00:00Z'), today) === 4 ? 'PASS' : 'FAIL');

console.log('--- Testing processHabitCompletion ---');
const res1 = processHabitCompletion(50, 5);
console.log('Completion (points +10, streak +1):', res1.newTotalPoints === 60 && res1.newStreak === 6 ? 'PASS' : 'FAIL');

console.log('--- Testing processMissedDays ---');
const res2 = processMissedDays(50, 2);
console.log('Missed 2 days (points -10, streak 0):', res2.newTotalPoints === 40 && res2.newStreak === 0 ? 'PASS' : 'FAIL');

const res3 = processMissedDays(10, 3);
console.log('Missed 3 days with point floor (points floor 0, streak 0):', res3.newTotalPoints === 0 && res3.newStreak === 0 ? 'PASS' : 'FAIL');
