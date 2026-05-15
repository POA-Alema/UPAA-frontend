'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value = '', onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value && editor.isEmpty) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-surface-container-high/50 border border-outline-variant/30 rounded-t-lg">
        {/* Heading */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded text-sm font-bold transition-all ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded text-sm font-bold transition-all ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded text-sm font-bold transition-all ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Divider */}
        <div className="w-px bg-outline-variant/30"></div>

        {/* Text styles */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-2 rounded transition-all ${
              editor.isActive('bold')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Bold"
          >
            <span className="material-symbols-outlined text-sm">format_bold</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-2 rounded transition-all ${
              editor.isActive('italic')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Italic"
          >
            <span className="material-symbols-outlined text-sm">format_italic</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-2 rounded transition-all ${
              editor.isActive('strike')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Strikethrough"
          >
            <span className="material-symbols-outlined text-sm">strikethrough_s</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px bg-outline-variant/30"></div>

        {/* Lists */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-2 rounded transition-all ${
              editor.isActive('bulletList')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Bullet list"
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-2 rounded transition-all ${
              editor.isActive('orderedList')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high hover:bg-surface-container-high/70'
            }`}
            title="Ordered list"
          >
            <span className="material-symbols-outlined text-sm">format_list_numbered</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px bg-outline-variant/30"></div>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-2 rounded transition-all ${
            editor.isActive('blockquote')
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high hover:bg-surface-container-high/70'
          }`}
          title="Blockquote"
        >
          <span className="material-symbols-outlined text-sm">format_quote</span>
        </button>

        {/* Divider */}
        <div className="w-px bg-outline-variant/30"></div>

        {/* Clear */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-3 py-2 rounded bg-surface-container-high hover:bg-surface-container-high/70 transition-all"
          title="Clear formatting"
        >
          <span className="material-symbols-outlined text-sm">format_clear</span>
        </button>
      </div>

      {/* Editor */}
      <div className="border border-outline-variant/30 border-t-0 rounded-b-lg bg-surface-container-high/20 overflow-hidden">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none px-4 py-3 min-h-64 focus:outline-none text-on-surface"
        />
      </div>

      {/* Help text */}
      <p className="text-on-surface/50 text-sm mt-2">
        💡 Dica: Use os botões acima para formatar o texto. Você pode usar <strong>negrito</strong>, <em>itálico</em> e listas.
      </p>
    </div>
  );
}
