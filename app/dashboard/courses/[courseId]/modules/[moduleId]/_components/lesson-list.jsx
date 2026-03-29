'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CirclePlay } from 'lucide-react';

export const LessonList = ({ items, onReorder, onEdit }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLessons(items);
  }, [items]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(lessons);
    const [reorderedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedLessons = reordered.slice(startIndex, endIndex + 1);

    setLessons(reordered);

    const bulkUpdateData = updatedLessons.map((lesson) => ({
      id: lesson._id,
      position: reordered.findIndex((item) => item._id === lesson._id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lessons'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => (
              <Draggable
                key={lesson._id} // ✅ _id not id
                draggableId={lesson._id} // ✅ _id not id
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-secondary border-slate-200 border text-foreground rounded-md mb-4 text-sm',
                      lesson.published && // ✅ published not isPublished
                        'bg-sky-100 border-sky-200 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        lesson.published && // ✅ published not isPublished
                          'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    <div className='flex items-center gap-2'>
                      <CirclePlay size={18} />
                      {lesson.title} {/* ✅ same */}
                    </div>
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      <Badge
                        className={cn(
                          'bg-secondary text-secondary-foreground',
                          lesson.published && 'bg-emerald-600', // ✅ published
                        )}
                      >
                        {lesson.published ? 'Published' : 'Draft'} {/* ✅ */}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(lesson._id)} // ✅ _id not id
                        className='w-4 h-4 cursor-pointer hover:opacity-75 transition'
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
