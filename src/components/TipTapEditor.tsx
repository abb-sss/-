import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Code from '@tiptap/extension-code';
import CharacterCount from '@tiptap/extension-character-count';
import { common, createLowlight } from 'lowlight';
import { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Quote, Code as CodeIcon, TerminalSquare, Calculator, Wand2, Check, X } from 'lucide-react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import SlashCommandList from './editor/SlashCommandList';
import { getSuggestionItems, renderItems } from './editor/slashExtension';
import { getCitationItems, renderCitationItems } from './editor/citationExtension';
import { Mark, mergeAttributes } from '@tiptap/core';
import { useEditorStore } from '@/store/useEditorStore';

// Custom extension for AI Diff highlighting
const AiDiffMark = Mark.create({
  name: 'aiDiff',

  addAttributes() {
    return {
      type: {
        default: 'insertion', // 'insertion' or 'deletion'
        parseHTML: element => element.getAttribute('data-diff-type'),
        renderHTML: attributes => {
          return {
            'data-diff-type': attributes.type,
            class: attributes.type === 'insertion' ? 'ai-diff-insertion' : 'ai-diff-deletion',
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-diff-type]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },
});

import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ghostText: {
      setGhostText: (text: string) => ReturnType;
      clearGhostText: () => ReturnType;
      acceptGhostText: () => ReturnType;
    }
  }
}

// Custom extension for Ghost Text Autocomplete
const GhostTextExtension = Extension.create({
  name: 'ghostText',

  addStorage() {
    return {
      ghostText: '',
      active: false,
    };
  },

  addCommands() {
    return {
      setGhostText: (text: string) => ({ editor }) => {
        editor.storage.ghostText.ghostText = text;
        editor.storage.ghostText.active = true;
        editor.view.dispatch(editor.state.tr.setMeta('ghostText', true));
        return true;
      },
      clearGhostText: () => ({ editor }) => {
        editor.storage.ghostText.ghostText = '';
        editor.storage.ghostText.active = false;
        editor.view.dispatch(editor.state.tr.setMeta('ghostText', true));
        return true;
      },
      acceptGhostText: () => ({ editor }) => {
        if (!editor.storage.ghostText.active || !editor.storage.ghostText.ghostText) return false;
        const text = editor.storage.ghostText.ghostText;
        editor.commands.clearGhostText();
        editor.chain().focus().insertContent(text).run();
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.acceptGhostText(),
      Escape: () => this.editor.commands.clearGhostText(),
      // Any other key should clear it
      ArrowUp: () => { this.editor.commands.clearGhostText(); return false; },
      ArrowDown: () => { this.editor.commands.clearGhostText(); return false; },
      ArrowLeft: () => { this.editor.commands.clearGhostText(); return false; },
      ArrowRight: () => { this.editor.commands.clearGhostText(); return false; },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('ghostTextPlugin'),
        state: {
          init: () => DecorationSet.empty,
          apply: (tr, oldState) => {
            if (tr.docChanged) {
              // Any document change clears the ghost text
              this.editor.storage.ghostText.ghostText = '';
              this.editor.storage.ghostText.active = false;
              return DecorationSet.empty;
            }
            if (tr.getMeta('ghostText')) {
              if (this.editor.storage.ghostText.active && this.editor.storage.ghostText.ghostText) {
                const { to } = tr.selection;
                const widget = document.createElement('span');
                widget.className = 'ghost-text';
                widget.textContent = this.editor.storage.ghostText.ghostText;
                const decoration = Decoration.widget(to, widget, { side: 1 });
                return DecorationSet.create(tr.doc, [decoration]);
              }
              return DecorationSet.empty;
            }
            return oldState;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

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

const MathExtension = Extension.create({
  name: 'mathExtension',
  addKeyboardShortcuts() {
    return {
      'Mod-m': () => {
        const text = prompt('请输入 LaTeX 公式:', 'E = mc^2');
        if (text) {
          try {
            const html = katex.renderToString(text, { throwOnError: false });
            this.editor.chain().focus().insertContent(`<span class="math-tex" data-tex="${text}">${html}</span>`).run();
          } catch (e) {
            console.error(e);
          }
        }
        return true;
      },
    };
  },
});

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
      <button
        onClick={() => {
          const text = prompt('请输入 LaTeX 公式:', 'E = mc^2');
          if (text) {
            try {
              const html = katex.renderToString(text, { throwOnError: false });
              editor.chain().focus().insertContent(`<span class="math-tex inline-block mx-1" data-tex="${text}">${html}</span>`).run();
            } catch (e) {
              console.error(e);
            }
          }
        }}
        className="p-2 rounded hover:bg-gray-200 transition text-gray-600"
        title="插入数学公式 (Cmd/Ctrl + M)"
      >
        <Calculator className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function TipTapEditor({ content, onChange, title, onTitleChange, formatStyle }: TipTapEditorProps) {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      AiDiffMark,
      MathExtension,
      CharacterCount,
      GhostTextExtension,
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
                useEditorStore.getState().addCitation(props);
                const currentCitations = useEditorStore.getState().citations;
                const citeIndex = currentCitations.findIndex(c => c.refId === props.refId) + 1;
                const tooltipHTML = `<div class="citation-tooltip"><div class="font-semibold mb-1">${props.title}</div><div class="text-gray-400 text-xs mb-2">${props.authors} (${props.year})</div><div class="text-gray-300 text-xs line-clamp-3">查看原文内容与详情...</div></div>`;
                editor.chain().focus().deleteRange(range).insertContent(` <span class="citation-mark" data-ref-id="${props.refId}">[${citeIndex}]${tooltipHTML}</span> `).run();
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
      // Clear previous timeout to debounce the heavy state updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Debounce the state sync to 300ms after user stops typing
      updateTimeoutRef.current = setTimeout(() => {
        onChange(editor.getHTML());
        
        // Extract headings for TOC (read-only)
        const headings: { id: string, text: string, level: number }[] = [];
        
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'heading') {
            headings.push({
              id: `heading-${pos}`,
              text: node.textContent,
              level: node.attrs.level,
            });
          }
        });
        
        const currentHeadings = useEditorStore.getState().headings;
        const isDifferent = currentHeadings.length !== headings.length || 
          headings.some((h, i) => h.id !== currentHeadings[i]?.id || h.text !== currentHeadings[i]?.text);
          
        if (isDifferent) {
          useEditorStore.getState().setHeadings(headings);
        }
        
        if (!editor.isDestroyed) {
          const wordCount = editor.storage.characterCount.words();
          const charCount = editor.storage.characterCount.characters();
          const currentStats = useEditorStore.getState();
          if (currentStats.wordCount !== wordCount || currentStats.charCount !== charCount) {
            useEditorStore.getState().setStats(wordCount, charCount);
          }
        }
      }, 300); // 300ms debounce
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none focus:outline-none min-h-[400px] text-gray-900 ${formatStyle === 'APA' ? 'format-apa' : formatStyle === 'IEEE' ? 'format-ieee' : formatStyle === 'MLA' ? 'format-mla' : 'format-default'}`,
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content && !editor.isFocused) {
      // Safely update external content
      if (!editor.isDestroyed) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  const handleAiSubmit = () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setShowAiInput(false);
      setAiPrompt("");
      if (editor) {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        editor.chain().focus().deleteSelection().insertContent(`
          <span data-diff-type="deletion">${selectedText}</span>
          <span data-diff-type="insertion">${selectedText} (AI: ${aiPrompt} 处理完成)</span>
        `).run();
      }
    }, 1500);
  };

  // Handle format style changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose max-w-none focus:outline-none min-h-[400px] text-gray-900 ${formatStyle === 'APA' ? 'format-apa' : formatStyle === 'IEEE' ? 'format-ieee' : formatStyle === 'MLA' ? 'format-mla' : 'format-default mx-auto max-w-3xl'}`,
          },
        },
      });
    }
  }, [formatStyle, editor]);

  useEffect(() => {
    if (!editor) return;
    
    // Handle AI ghost text simulation when user pauses
    let typingTimer: any;
    const handleUpdate = () => {
      clearTimeout(typingTimer);
      const { state } = editor;
      const text = state.doc.textBetween(Math.max(0, state.selection.to - 10), state.selection.to, ' ');
      if (text.trim().length > 5) {
        typingTimer = setTimeout(() => {
          // Ensure we are still focused before showing ghost text
          if (!editor.isFocused || editor.isDestroyed) return;
          // Only trigger if at the end of a paragraph/heading
          const $pos = state.selection.$to;
          if ($pos.parentOffset === $pos.parent.content.size) {
            const suggestedText = "Furthermore, recent studies suggest a paradigm shift in this domain.";
            editor.commands.setGhostText(suggestedText);
          }
        }, 1500); // Trigger after 1.5s of no typing
      }
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
      clearTimeout(typingTimer);
    };
  }, [editor]);

  return (
    <div className={`bg-white min-h-[800px] shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-16 relative group ${formatStyle === 'IEEE' ? 'max-w-[900px] mx-auto' : 'max-w-4xl mx-auto'}`}>
      <MenuBar editor={editor} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className={`flex ${showAiInput ? 'bg-white shadow-xl border-blue-200 w-80 flex-col' : 'bg-gray-900 border-gray-700'} rounded-lg shadow-lg overflow-hidden p-1 text-white border`}>
          {!showAiInput ? (
            <div className="flex items-center">
              <button
                onClick={() => setShowAiInput(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 transition text-white font-medium text-xs mr-1"
                title="AI 助手"
              >
                <Wand2 className="w-3.5 h-3.5" /> Ask AI
              </button>
              <div className="w-px h-5 bg-gray-700 mx-1 self-center"></div>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-800 transition ${editor.isActive('bold') ? 'text-blue-400' : 'text-gray-300'}`}
                title="加粗"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-800 transition ${editor.isActive('italic') ? 'text-blue-400' : 'text-gray-300'}`}
                title="斜体"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-gray-800 transition ${editor.isActive('strike') ? 'text-blue-400' : 'text-gray-300'}`}
                title="删除线"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-700 mx-1 self-center"></div>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-1.5 rounded hover:bg-gray-800 transition ${editor.isActive('code') ? 'text-blue-400' : 'text-gray-300'}`}
                title="行内代码"
              >
                <CodeIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                autoFocus
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAiSubmit();
                  if (e.key === 'Escape') setShowAiInput(false);
                }}
                disabled={isAiLoading}
                placeholder="要求 AI 润色、翻译或改写..."
                className="flex-1 bg-transparent text-gray-800 text-sm focus:outline-none placeholder-gray-400"
              />
              {isAiLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
              ) : (
                <div className="flex items-center gap-1">
                  <button onClick={handleAiSubmit} className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setShowAiInput(false); setAiPrompt(""); }} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </BubbleMenu>
      )}
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
