"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Bold, Link2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";

type RichTextEditorProps = {
  value: unknown;
  onChange: (json: unknown) => void;
  className?: string;
};

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-5" } },
        listItem: { HTMLAttributes: { class: "leading-relaxed" } },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: (value as object) ?? EMPTY_TIPTAP_DOC,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  useEffect(() => {
    if (!editor) return;
    const next = (value as object) ?? EMPTY_TIPTAP_DOC;
    const cur = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(next);
    if (cur !== incoming) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
          Bold
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" />
          Bullets
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Link URL", prev ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          <Link2 className="size-3.5" />
          Link
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
