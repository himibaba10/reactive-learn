'use client';
import { completeWatch, startWatch } from '@/app/actions/watch';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({
  videoUrl,
  lessonId,
  moduleId,
  courseId,
  extend = false,
}) => {
  if (!extend) {
    return (
      <ReactPlayer
        src={videoUrl}
        controls
        style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
      />
    );
  }

  const handlePlay = async () => {
    await startWatch({ lessonId, moduleId, courseId });
  };

  const handleEnded = async () => {
    await completeWatch({ lessonId, courseId, moduleId });
  };

  return (
    <ReactPlayer
      src={videoUrl}
      controls
      style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
      onPlay={handlePlay}
      onEnded={handleEnded}
    />
  );
};
