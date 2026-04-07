import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { bcClass } from "@/features/portfolio-public/bc-theme";
import { cn } from "@/lib/utils";

const extensions = [
  StarterKit,
  Link.configure({ openOnClick: true }),
];

const toneClass = {
  default:
    "text-muted-foreground [&_a]:text-primary [&_strong]:text-foreground",
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
        " text-xs leading-relaxed [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5",
        toneClass[tone],
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
