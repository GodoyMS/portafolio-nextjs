"use client";

import { AdminErrorView } from "@/features/admin/components/admin-error-view";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
};

export default function AdminDashboardError({ error, reset, unstable_retry }: ErrorPageProps) {
  return <AdminErrorView error={error} retry={unstable_retry ?? reset ?? (() => window.location.reload())} />;
}
