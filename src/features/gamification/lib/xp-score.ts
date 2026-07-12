export function getLevelFromXp(xp: number): { level: number; nextLevelXp: number; progress: number } {
  // Simple levels sizing: Level = floor(sqrt(xp / 100)) + 1
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelMinXp = Math.pow(level - 1, 2) * 100;
  const nextLevelMinXp = Math.pow(level, 2) * 100;

  const xpInCurrentLevel = xp - currentLevelMinXp;
  const totalXpRequiredForLevel = nextLevelMinXp - currentLevelMinXp;

  const progress = totalXpRequiredForLevel > 0
    ? Math.min(100, Math.round((xpInCurrentLevel / totalXpRequiredForLevel) * 100))
    : 0;

  return {
    level,
    nextLevelXp: nextLevelMinXp,
    progress,
  };
}
