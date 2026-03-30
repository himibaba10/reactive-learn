import { Watch } from '@/models/watch.model';
import { dbConnect } from '@/service/mongo';

export async function getCompletedLessons(userId, courseId) {
  await dbConnect();
  const completedWatches = await Watch.find({
    user: userId,
    course: courseId,
    state: 'completed',
  })
    .select('lesson')
    .lean();
  return completedWatches.map((w) => w.lesson.toString());
}

