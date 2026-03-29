'use client';
import { uploadCourseImage } from '@/app/actions/course-image';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export const UploadDropzone = ({
  isMulti = false,
  courseId,
  onUploadComplete,
}) => {
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      const progressInterval = startSimulatedProgress();

      try {
        // Build FormData and call server action
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);

        const result = await uploadCourseImage(formData);

        if (result.success) {
          setDroppedFiles(acceptedFiles);
          setUploadProgress(100);
          clearInterval(progressInterval);
          toast.success('Image uploaded successfully!');
          onUploadComplete();
        } else {
          toast.error(result.error || 'Upload failed');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setIsUploading(false);
        clearInterval(progressInterval);
      }
    },
    [courseId, onUploadComplete],
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: isMulti,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  // Better rejection messages
  useEffect(() => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((e) => toast.error(`${file.name}: ${e.message}`));
    });
  }, [fileRejections]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'mt-3 flex cursor-pointer items-center justify-center rounded-md border border-dashed p-3 py-12 hover:bg-muted/30',
        isUploading ? 'pointer-events-none !cursor-not-allowed opacity-80' : '',
      )}
    >
      <input multiple={isMulti} {...getInputProps()} disabled={isUploading} />
      <div className='flex flex-col items-center gap-3 text-center !text-[#858585]'>
        <CloudUpload size={48} className='text-muted-foreground' />
        <h4 className='!font-normal !text-[#858585]'>
          <span className='font-semibold text-black underline'>
            Click to upload
          </span>{' '}
          or drag and drop <br />
          Maximum file size 50 MB.
        </h4>
        {isUploading && (
          <div className='mx-auto mt-4 w-full max-w-xs'>
            <Progress
              value={uploadProgress}
              className='h-1 w-full bg-zinc-200'
            />
          </div>
        )}
        {/* Show filename after upload */}
        {droppedFiles && !isUploading && (
          <p className='text-sm text-green-600'>
            {droppedFiles[0].name} uploaded ✓
          </p>
        )}
      </div>
    </div>
  );
};
