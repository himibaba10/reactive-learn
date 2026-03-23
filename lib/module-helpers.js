export function calculateModuleProgress(completedModules, totalModules) {
  if (!totalModules || totalModules === 0) return 0;
  const progress = (completedModules / totalModules) * 100;
  return Math.min(Math.round(progress), 100);
}
