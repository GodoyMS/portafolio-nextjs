"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteWorkExperience } from "@/features/work-experience/actions";
import { MoreHorizontal } from "lucide-react";

export function WorkExperienceRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={pending} aria-label="Actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/work-experience/${id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            if (!confirm("Delete this work experience?")) return;
            startTransition(async () => {
              const res = await deleteWorkExperience(id);
              if (!res.ok) toast.error(res.error);
              else {
                toast.success("Deleted.");
                router.refresh();
              }
            });
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
