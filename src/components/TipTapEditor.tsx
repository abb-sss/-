import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function TipTapEditor({ content, onChange, title, onTitleChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: '在这里开始你的创作，或使用右侧文献助手进行智能扩写...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] text-gray-800 font-serif leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-16 relative">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="无标题文档"
        className="w-full text-4xl font-bold font-serif mb-8 outline-none placeholder-gray-300 bg-transparent"
      />
      <EditorContent editor={editor} />
    </div>
  );
}
