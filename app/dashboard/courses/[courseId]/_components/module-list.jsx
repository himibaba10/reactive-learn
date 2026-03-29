'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Pencil } from 'lucide-react';
import { useState } from 'react';

export const ModuleList = ({ items, onReorder, onEdit }) => {
  const [modules, setModules] = useState(items);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedModules = items.slice(startIndex, endIndex + 1);

    setModules(items);

    const bulkUpdateData = updatedModules.map((module) => ({
      id: module?._id,
      position: items.findIndex((item) => item?._id === module?._id),
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='modules'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {modules?.map((module, index) => (
              <Draggable
                key={module?._id}
                draggableId={module?._id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-secondary border-slate-200 border text-foreground rounded-md mb-4 text-sm',
                      module?.status === 'active' &&
                        'bg-sky-100 border-sky-200 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        module?.status === 'active' &&
                          'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    {module.title}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      <Badge
                        className={cn(
                          'bg-secondary text-secondary-foreground',
                          module?.status === 'active' && 'bg-emerald-600',
                        )}
                      >
                        {module?.status === 'active' ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(module?._id)}
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
