import { Watch } from '@/models/watch.model';

export async function getCompletedLessons(userId, courseId) {
  const completedWatches = await Watch.find({
    user: userId,
    course: courseId,
    state: 'completed',
  })
    .select('lesson')
    .lean();
  return completedWatches.map((w) => w.lesson.toString());
}
