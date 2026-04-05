import { create } from 'zustand';

interface Citation {
  id: string;
  refId: string;
  title: string;
  authors: string;
  year: string;
  source: string;
}

interface EditorState {
  title: string;
  content: string;
  formatStyle: string;
  citations: Citation[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setFormatStyle: (style: string) => void;
  addCitation: (citation: Citation) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  title: '深度学习在医学图像处理中的应用研究',
  content: `
    <p>医学图像处理是现代医疗诊断中不可或缺的一环。随着计算能力的提升，深度学习方法在这一领域展现出了巨大的潜力。</p>
  `,
  formatStyle: '默认',
  citations: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setFormatStyle: (formatStyle) => set({ formatStyle }),
  addCitation: (citation) => set((state) => {
    if (state.citations.some(c => c.refId === citation.refId)) {
      return state; // 如果已经存在该引用，则不重复添加
    }
    return { citations: [...state.citations, citation] };
  }),
}));
