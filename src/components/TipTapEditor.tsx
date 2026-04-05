import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Code from '@tiptap/extension-code';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Quote, Code as CodeIcon, TerminalSquare } from 'lucide-react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import SlashCommandList from './editor/SlashCommandList';
import { getSuggestionItems, renderItems } from './editor/slashExtension';
import { getCitationItems, renderCitationItems } from './editor/citationExtension';

const lowlight = createLowlight(common);

// Slash Command Plugin
const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

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
      
      <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('code') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="行内代码"
      >
        <CodeIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('codeBlock') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
        title="代码块"
      >
        <TerminalSquare className="w-4 h-4" />
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
          HTMLAttributes: {
            class: 'scroll-mt-20',
          },
        },
        code: false,
        codeBlock: false,
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 text-red-500 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] mx-0.5',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-[#282c34] text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder: '输入 "/" 唤起块菜单，或使用右侧助手...',
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
      Extension.create({
        name: 'citationCommand',
        addOptions() {
          return {
            suggestion: {
              char: '@',
              command: ({ editor, range, props }: any) => {
                // @ts-ignore
                import('@/store/useEditorStore').then(({ useEditorStore }) => {
                  useEditorStore.getState().addCitation(props);
                  const currentCitations = useEditorStore.getState().citations;
                  const citeIndex = currentCitations.findIndex(c => c.refId === props.refId) + 1;
                  editor.chain().focus().deleteRange(range).insertContent(` <span class="citation-mark" data-ref-id="${props.refId}" title="${props.title}">[${citeIndex}]</span> `).run();
                });
              },
            },
          };
        },
        addProseMirrorPlugins() {
          return [
            Suggestion({
              editor: this.editor,
              ...this.options.suggestion,
            }),
          ];
        },
      }).configure({
        suggestion: {
          items: getCitationItems,
          render: renderCitationItems,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Extract headings for TOC
      const headings: { id: string, text: string, level: number }[] = [];
      const transaction = editor.state.tr;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const id = `heading-${pos}`;
          if (node.attrs.id !== id) {
            transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id });
          }
          headings.push({
            id,
            text: node.textContent,
            level: node.attrs.level,
          });
        }
      });
      if (transaction.steps.length > 0) {
        editor.view.dispatch(transaction);
      }
      
      // Update TOC in store
      import('@/store/useEditorStore').then(({ useEditorStore }) => {
        // Wrap the state update in a setTimeout to avoid updating state during render
        setTimeout(() => {
          useEditorStore.getState().setHeadings(headings);
        }, 0);
      });
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
