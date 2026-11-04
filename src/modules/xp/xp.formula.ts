export const xpForNextLevel = (level: number): number => {
  return 5 * level ** 2 + 50 * level + 100;
};

export const progressInLevel = (totalXp: number) => {
  let level = 0;
  let remaining = totalXp;

  while (remaining >= xpForNextLevel(level)) {
    remaining -= xpForNextLevel(level);
    level++;
  }

  return {
    level,
    current: remaining,
    needed: xpForNextLevel(level),
  };
};

export const levelFromXp = (totalXp: number): number => {
  return progressInLevel(totalXp).level;
};
