import { create } from 'zustand';

interface Citation {
  id: string;
  refId: string;
  title: string;
  authors: string;
  year: string;
  source: string;
}

export interface Project {
  id: string;
  title: string;
  content: string;
  formatStyle: string;
  citations: Citation[];
  headings: { id: string, text: string, level: number }[];
  wordCount: number;
  charCount: number;
  lastModified: string;
}

interface EditorState {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProject: (id: string) => void;
  createProject: () => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Helpers for current active project
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

const defaultProject: Project = {
  id: '1',
  title: '深度学习在医学图像处理中的应用研究',
  content: `
    <h1>1. 引言</h1>
    <p>医学图像处理是现代医疗诊断中不可或缺的一环。随着计算能力的提升，深度学习方法在这一领域展现出了巨大的潜力。</p>
    <h2>1.1 研究背景</h2>
    <p>传统方法依赖于手工设计的特征，这在处理复杂的医学图像时往往显得力不从心。</p>
    <h2>1.2 研究目的</h2>
    <p>本文旨在探讨深度学习模型，特别是卷积神经网络（CNN）在医学图像分割和分类中的应用。</p>
  `,
  formatStyle: 'IEEE',
  citations: [],
  headings: [],
  wordCount: 0,
  charCount: 0,
  lastModified: '刚刚',
};

const defaultProject2: Project = {
  id: '2',
  title: '大语言模型对现代教育的影响分析',
  content: `
    <h1>1. 摘要</h1>
    <p>随着大语言模型（LLMs）的发展，教育方式正在发生深刻的变革。本文分析了LLMs在辅助教学和个性化学习中的应用。</p>
  `,
  formatStyle: 'APA',
  citations: [],
  headings: [],
  wordCount: 0,
  charCount: 0,
  lastModified: '昨天 14:30',
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projects: [defaultProject, defaultProject2],
  activeProjectId: '1',
  
  setActiveProject: (id) => set({ activeProjectId: id }),
  
  createProject: () => {
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      title: '未命名文档',
      content: '',
      formatStyle: '默认',
      citations: [],
      headings: [],
      wordCount: 0,
      charCount: 0,
      lastModified: '刚刚',
    };
    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProjectId: newId,
    }));
    return newId;
  },
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates, lastModified: '刚刚' } : p)
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    activeProjectId: state.activeProjectId === id ? (state.projects.find(p => p.id !== id)?.id || null) : state.activeProjectId,
  })),

  // Getters for active project
  get title() { return get().projects.find(p => p.id === get().activeProjectId)?.title || ''; },
  get content() { return get().projects.find(p => p.id === get().activeProjectId)?.content || ''; },
  get formatStyle() { return get().projects.find(p => p.id === get().activeProjectId)?.formatStyle || '默认'; },
  get citations() { return get().projects.find(p => p.id === get().activeProjectId)?.citations || []; },
  get headings() { return get().projects.find(p => p.id === get().activeProjectId)?.headings || []; },
  get wordCount() { return get().projects.find(p => p.id === get().activeProjectId)?.wordCount || 0; },
  get charCount() { return get().projects.find(p => p.id === get().activeProjectId)?.charCount || 0; },

  // Setters for active project
  setTitle: (title) => {
    const id = get().activeProjectId;
    if (id) get().updateProject(id, { title });
  },
  setContent: (content) => {
    const id = get().activeProjectId;
    if (id) get().updateProject(id, { content });
  },
  setFormatStyle: (formatStyle) => {
    const id = get().activeProjectId;
    if (id) get().updateProject(id, { formatStyle });
  },
  addCitation: (citation) => {
    const id = get().activeProjectId;
    if (id) {
      const project = get().projects.find(p => p.id === id);
      if (project && !project.citations.some(c => c.refId === citation.refId)) {
        get().updateProject(id, { citations: [...project.citations, citation] });
      }
    }
  },
  setHeadings: (headings) => {
    const id = get().activeProjectId;
    if (id) get().updateProject(id, { headings });
  },
  setStats: (wordCount, charCount) => {
    const id = get().activeProjectId;
    if (id) get().updateProject(id, { wordCount, charCount });
  },
}));
