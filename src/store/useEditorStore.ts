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
  headings: { id: string, text: string, level: number }[];
  wordCount: number;
  charCount: number;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setFormatStyle: (style: string) => void;
  addCitation: (citation: Citation) => void;
  setHeadings: (headings: { id: string, text: string, level: number }[]) => void;
  setStats: (words: number, chars: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  title: '深度学习在医学图像处理中的应用研究',
  content: `
    <h1>1. 引言</h1>
    <p>医学图像处理是现代医疗诊断中不可或缺的一环。随着计算能力的提升，深度学习方法在这一领域展现出了巨大的潜力。</p>
    <h2>1.1 研究背景</h2>
    <p>传统方法依赖于手工设计的特征，这在处理复杂的医学图像时往往显得力不从心。</p>
    <h2>1.2 研究目的</h2>
    <p>本文旨在探讨深度学习模型，特别是卷积神经网络（CNN）在医学图像分割和分类中的应用。</p>
  `,
  formatStyle: '默认',
  citations: [],
  headings: [],
  wordCount: 0,
  charCount: 0,
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setFormatStyle: (formatStyle) => set({ formatStyle }),
  addCitation: (citation) => set((state) => {
    if (state.citations.some(c => c.refId === citation.refId)) {
      return state; // 如果已经存在该引用，则不重复添加
    }
    return { citations: [...state.citations, citation] };
  }),
  setHeadings: (headings) => set({ headings }),
  setStats: (wordCount, charCount) => set({ wordCount, charCount }),
}));
