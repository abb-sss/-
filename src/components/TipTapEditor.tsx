import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Quote } from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  formatStyle: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sticky top-0 z-10 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="加粗"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="斜体"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="删除线"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="标题 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="标题 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="标题 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="引用块"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function TipTapEditor({ content, onChange, title, onTitleChange, formatStyle }: TipTapEditorProps) {
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
        class: `prose max-w-none focus:outline-none min-h-[400px] text-gray-900 ${formatStyle === 'APA' ? 'format-apa' : formatStyle === 'IEEE' ? 'format-ieee' : formatStyle === 'MLA' ? 'format-mla' : 'format-default'}`,
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle format style changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose max-w-none focus:outline-none min-h-[400px] text-gray-900 ${formatStyle === 'APA' ? 'format-apa' : formatStyle === 'IEEE' ? 'format-ieee' : formatStyle === 'MLA' ? 'format-mla' : 'format-default'}`,
          },
        },
      });
    }
  }, [formatStyle, editor]);

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-16 relative group">
      <MenuBar editor={editor} />
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="无标题文档"
        className={`w-full font-bold mb-8 outline-none placeholder-gray-300 bg-transparent ${formatStyle === 'APA' ? 'format-apa text-3xl text-center' : formatStyle === 'IEEE' ? 'format-ieee text-3xl text-center uppercase' : formatStyle === 'MLA' ? 'format-mla text-3xl text-left font-normal' : 'format-default text-4xl font-serif'}`}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
