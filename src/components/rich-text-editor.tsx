"use client";

import { useCallback, useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EMPTY_TIPTAP_DOC } from "@/lib/empty-rich-text";

type RichTextEditorProps = {
  value: unknown;
  onChange: (json: unknown) => void;
  className?: string;
};

function ToolbarBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="h-7 w-7 p-0"
    >
      {children}
    </Button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-input bg-muted/40 p-1">
      {/* History */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="size-3.5" />
      </ToolbarBtn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Headings */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="size-3.5" />
      </ToolbarBtn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Inline marks */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        <Code className="size-3.5" />
      </ToolbarBtn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Links */}
      <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Set link">
        <Link2 className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove link"
      >
        <Link2Off className="size-3.5" />
      </ToolbarBtn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Block formatting */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered list"
      >
        <ListOrdered className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="size-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code2 className="size-3.5" />
      </ToolbarBtn>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <ToolbarBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        <Minus className="size-3.5" />
      </ToolbarBtn>
    </div>
  );
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-5 space-y-1" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-5 space-y-1" } },
        listItem: { HTMLAttributes: { class: "leading-relaxed" } },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-border pl-4 italic text-muted-foreground my-2",
          },
        },
        codeBlock: {
          HTMLAttributes: { class: "rounded bg-muted px-3 py-2 font-mono text-sm my-2" },
        },
        code: {
          HTMLAttributes: { class: "rounded bg-muted px-1 py-0.5 font-mono text-xs" },
        },
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: (value as object) ?? EMPTY_TIPTAP_DOC,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[200px] rounded-b-md border border-t-0 border-input bg-background/50",
          "px-3 py-3 text-sm outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "[&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-1 [&_h1]:mt-3 [&_h1:first-child]:mt-0",
          "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1 [&_h2]:mt-3 [&_h2:first-child]:mt-0",
          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2 [&_h3:first-child]:mt-0",
          "[&_p+p]:mt-2",
          "[&_ul]:mt-1 [&_ol]:mt-1",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          "[&_hr]:my-3 [&_hr]:border-border",
        ),
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
    <div className={cn("rounded-md", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
