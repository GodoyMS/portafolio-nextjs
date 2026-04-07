import { WorkExperienceForm } from "@/features/admin/components/work-experience-form";

export default function NewWorkExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New work experience</h1>
        <p className="text-muted-foreground text-sm">Add a role with rich description and links.</p>
      </div>
      <WorkExperienceForm />
    </div>
  );
}
