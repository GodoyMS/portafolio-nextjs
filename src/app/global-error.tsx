"use client";

import { describeAdminError } from "@/lib/admin-errors";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  const message = describeAdminError(error);
  const digest = error.digest;
  const retry = unstable_retry ?? reset ?? (() => window.location.reload());

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#0a192f", color: "#ccd6f6", margin: 0 }}>
        <main style={{ maxWidth: 520, margin: "80px auto", padding: "0 16px" }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>This page couldn’t load</h1>
          <p style={{ lineHeight: 1.5, color: "#8892b0" }}>{message}</p>
          {digest ? (
            <p style={{ fontSize: 12, color: "#64748b" }}>Reference: {digest}</p>
          ) : null}
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: 16,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #64ffda",
              background: "transparent",
              color: "#64ffda",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
