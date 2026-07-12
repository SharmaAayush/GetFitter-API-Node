// Higher number = higher priority
const levelPriorityMap: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  expert: 3,
}

export const getLevelPriority = (level: string): number => {
  return levelPriorityMap[level] || 0;
}

export const getMaxLevel = (levels: string[]) => {
  return levels.map(getLevelPriority).reduce((a, b) => Math.max(a, b), 0);
}
