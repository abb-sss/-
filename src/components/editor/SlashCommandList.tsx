import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Heading1, Heading2, Heading3, Type, Quote, List, ListOrdered, Code, TerminalSquare } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  Heading1: <Heading1 className="w-4 h-4" />,
  Heading2: <Heading2 className="w-4 h-4" />,
  Heading3: <Heading3 className="w-4 h-4" />,
  Text: <Type className="w-4 h-4" />,
  Quote: <Quote className="w-4 h-4" />,
  List: <List className="w-4 h-4" />,
  ListOrdered: <ListOrdered className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  TerminalSquare: <TerminalSquare className="w-4 h-4" />,
};

interface SlashCommandListProps {
  items: any[];
  command: (item: any) => void;
}

const SlashCommandList = forwardRef((props: SlashCommandListProps, ref) => {
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
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-64 flex flex-col py-1">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80">
        基础块
      </div>
      {props.items.map((item, index) => (
        <button
          className={`flex items-center gap-3 px-3 py-2 text-left w-full transition-colors ${
            index === selectedIndex ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
          }`}
          key={index}
          onClick={() => selectItem(index)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-200 bg-white text-gray-500 shrink-0">
            {icons[item.icon]}
          </div>
          <div>
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

export default SlashCommandList;