import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import CitationSuggestionList from './CitationSuggestionList';

export const getCitationItems = ({ query }: { query: string }) => {
  // 这里模拟从全局或者本地库中检索文献

  const mockLibrary = [
    {
      id: '1',
      refId: 'ref-1',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, et al.',
      year: '2017',
      source: 'Advances in neural information processing systems'
    },
    {
      id: '2',
      refId: 'ref-2',
      title: 'Deep learning',
      authors: 'Yann LeCun, Yoshua Bengio, Geoffrey Hinton',
      year: '2015',
      source: 'Nature'
    },
    {
      id: '3',
      refId: 'ref-3',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
      authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
      year: '2018',
      source: 'arXiv preprint arXiv:1810.04805'
    },
    {
      id: '4',
      refId: 'ref-4',
      title: 'Language Models are Few-Shot Learners',
      authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, et al.',
      year: '2020',
      source: 'Advances in neural information processing systems'
    }
  ];

  return mockLibrary.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.authors.toLowerCase().includes(query.toLowerCase())
  );
};

export const renderCitationItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(CitationSuggestionList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },

    onUpdate(props: any) {
      component?.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup?.[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown(props: any) {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();
        return true;
      }
      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },

    onExit() {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};