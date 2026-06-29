"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Project, ProjectSkill, ProjectLink } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ProjectRowActions } from "./project-row-actions";
import { reorderProjects } from "@/features/projects/actions";
import { cn } from "@/lib/utils";

type Row = Project & { skills: ProjectSkill[]; links: ProjectLink[] };

function SortableRow({ row }: { row: Row }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-border transition-colors",
        isDragging && "relative z-50 rounded-lg bg-card shadow-lg opacity-90",
      )}
    >
      {/* drag handle */}
      <td className="w-8 py-3 pl-3 pr-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
      </td>
      <td className="py-3 pr-4 font-medium">{row.title}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{row.year}</td>
      <td className="py-3 pr-4">
        <Badge variant="secondary">{row.type}</Badge>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        {row.isFeatured ? "Yes" : "—"}
      </td>
      <td className="py-3 pr-3 text-right">
        <ProjectRowActions id={row.id} />
      </td>
    </tr>
  );
}

export function ProjectsTableDnd({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const reordered = arrayMove(rows, oldIndex, newIndex);

    setRows(reordered);

    startTransition(async () => {
      const res = await reorderProjects(reordered.map((r) => r.id));
      if (!res.ok) {
        setRows(rows);
        toast.error("Failed to save order.");
      }
    });
  }

  return (
    <div className="border-border overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
            <th className="w-8 py-3 pl-3 pr-1" />
            <th className="py-3 pr-4">Title</th>
            <th className="py-3 pr-4">Year</th>
            <th className="py-3 pr-4">Type</th>
            <th className="py-3 pr-4">Featured</th>
            <th className="w-[120px] py-3 pr-3 text-right">Actions</th>
          </tr>
        </thead>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {rows.map((row) => (
                <SortableRow key={row.id} row={row} />
              ))}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>
    </div>
  );
}
