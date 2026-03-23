'use client';

import { updateProfilePicture } from '@/app/actions/profile';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const ProfilePicture = ({ profilePicture, fullName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(profilePicture);

  const handleUpload = async (result) => {
    if (!result?.info?.secure_url) return;

    try {
      setIsUploading(true);

      const response = await updateProfilePicture(result.info.secure_url);

      setImagePreview(response.url);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='relative size-28 mx-auto group'>
      <Image
        src={imagePreview || '/default-avatar.png'}
        className='rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 w-full h-full object-cover transition-all group-hover:ring-sky-200 group-hover:dark:ring-sky-900'
        alt={fullName}
        width={112}
        height={112}
        priority
      />

      {/* Cloudinary Upload Widget */}
      <CldUploadWidget
        uploadPreset='Reactive Learn'
        onSuccess={handleUpload}
        options={{
          maxFiles: 1,
          cropping: true,
          croppingAspectRatio: 1,
          showAdvancedOptions: false,
          sources: ['local'],
          multiple: false,
          resourceType: 'image',
          autoUpload: false,
          showCompletedButton: true,
        }}
      >
        {({ open }) => (
          <button
            type='button'
            onClick={() => open()}
            disabled={isUploading}
            className='absolute inset-0 rounded-full bg-black/20 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center'
            title='Change profile picture'
          >
            {isUploading ? (
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            )}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ProfilePicture;
