import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BookMarked } from 'lucide-react';

interface CitationSuggestionListProps {
  items: any[];
  command: (item: any) => void;
}

const CitationSuggestionList = forwardRef((props: CitationSuggestionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-80 flex flex-col py-3 px-4 text-sm text-gray-500 text-center">
        未找到相关文献
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-80 flex flex-col py-1">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80">
        插入引用
      </div>
      <div className="max-h-60 overflow-y-auto">
        {props.items.map((item, index) => (
          <button
            className={`flex items-start gap-3 px-3 py-2.5 text-left w-full transition-colors ${
              index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className={`mt-0.5 shrink-0 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-400'}`}>
              <BookMarked className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-medium truncate ${index === selectedIndex ? 'text-blue-700' : 'text-gray-900'}`}>
                {item.title}
              </div>
              <div className="text-xs text-gray-500 truncate mt-0.5">
                {item.authors} • {item.year}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

CitationSuggestionList.displayName = 'CitationSuggestionList';

export default CitationSuggestionList;