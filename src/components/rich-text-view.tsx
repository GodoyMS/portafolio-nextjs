import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { bcClass } from "@/features/portfolio-public/bc-theme";
import { cn } from "@/lib/utils";

const extensions = [StarterKit, Link.configure({ openOnClick: true })];

const toneClass = {
  default:
    "text-muted-foreground [&_a]:text-primary [&_strong]:text-foreground [&_em]:italic [&_s]:line-through",
  portfolio: bcClass.richText,
} as const;

export function RichTextView({
  doc,
  className,
  tone = "default",
}: {
  doc: unknown;
  className?: string;
  tone?: keyof typeof toneClass;
}) {
  let html = "<p></p>";
  try {
    html = generateHTML(doc as Parameters<typeof generateHTML>[0], extensions);
  } catch {
    /* keep fallback */
  }
  return (
    <div
      className={cn(
        "text-xs leading-relaxed",
        // Paragraphs
        "[&_p+p]:mt-2",
        // Headings
        "[&_h1]:text-sm [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:mb-1 [&_h1]:mt-3 [&_h1]:first:mt-0",
        "[&_h2]:text-xs [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:first:mt-0",
        "[&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:first:mt-0",
        // Lists
        "[&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
        "[&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
        // Blockquote
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2",
        // Code
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px]",
        "[&_pre]:rounded [&_pre]:bg-muted [&_pre]:px-3 [&_pre]:py-2 [&_pre]:font-mono [&_pre]:text-[11px] [&_pre]:my-2 [&_pre]:overflow-x-auto",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // HR
        "[&_hr]:my-3 [&_hr]:border-border",
        // Inline marks
        "[&_em]:italic [&_s]:line-through",
        toneClass[tone],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
