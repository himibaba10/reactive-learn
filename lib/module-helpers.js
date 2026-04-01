export function calculateModuleProgress(completedModules, totalModules) {
  if (typeof completedModules !== 'number' || typeof totalModules !== 'number') {
    throw new Error('calculateModuleProgress function error: Expected a number');
  }

  if (completedModules < 0 || totalModules < 0) {
    throw new Error('completedModules and totalModules can not be less than 0');
  }

  if (!totalModules || totalModules === 0) return 0;

  if (completedModules > totalModules) {
    throw new Error('completedModules can not be greater than totalModules');
  }

  const progress = (completedModules / totalModules) * 100;
  return Math.min(Math.round(progress), 100);
}
