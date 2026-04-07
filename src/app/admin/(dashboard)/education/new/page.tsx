import { EducationForm } from "@/features/admin/components/education-form";

export default function NewEducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New education</h1>
        <p className="text-muted-foreground text-sm">Add an institution and degree.</p>
      </div>
      <EducationForm />
    </div>
  );
}
