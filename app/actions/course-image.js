'use server';
import { actionError, actionSuccess } from '@/lib/actionResponse';
import { Course } from '@/models/course.model';
import { existsSync, mkdirSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';

export async function uploadCourseImage(formData) {
  try {
    const file = formData.get('file');
    const courseId = formData.get('courseId');

    if (!file || typeof file === 'string') {
      return actionError('No file provided');
    }

    // Sanitize filename and make unique
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replaceAll(' ', '_');
    const filename = `${Date.now()}_${baseName}${ext}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public/assets/images/courses');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    await Course.findByIdAndUpdate(courseId, { thumbnail: filename });

    return actionSuccess(filename);
  } catch (error) {
    console.error('Upload error:', error);
    return actionError(error);
  }
}

export async function deleteCourseImage(filename) {
  try {
    if (!filename) return actionSuccess(null);

    const imagePath = path.join(
      process.cwd(),
      'public/assets/images/courses',
      filename,
    );

    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }

    return actionSuccess(null);
  } catch (error) {
    console.error('Image delete error:', error);
    return actionError(error);
  }
}
