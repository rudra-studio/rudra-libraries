import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered 
} from 'lucide-react';

export interface RichTextEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string; 
  placeholder?: string; /* @translate */
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({
  value = '<p>Start typing your document...</p>',
  placeholder = 'Write something amazing...',
  readOnly = false,
  className = '',
  onChange,
  ...props
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Track active formatting states (e.g., is the cursor currently on bold text?)
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  // Update active toolbar buttons based on cursor position/selection
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current || document.activeElement !== editorRef.current) return;
      
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Execute the formatting command
  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    
    // Force trigger onChange because execCommand doesn't always fire the onInput event
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    
    // Re-evaluate active buttons
    if (editorRef.current) editorRef.current.focus();
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    isActive = false 
  }: { 
    icon: any, 
    command: string, 
    isActive?: boolean 
  }) => (
    <button 
      disabled={readOnly}
      // CRITICAL: Prevent default on mouse down so the editor doesn't lose focus!
      onMouseDown={(e) => {
        e.preventDefault();
        executeCommand(command);
      }}
      className={`p-1.5 rounded transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50'
      }`}
    >
      <Icon size={16} strokeWidth={2.5} />
    </button>
  );

  return (
    <div className={`w-full flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm ${className}`} {...props}>
      
      {/* Formatting Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex-wrap">
          <ToolbarButton icon={Bold} command="bold" isActive={activeFormats.bold} />
          <ToolbarButton icon={Italic} command="italic" isActive={activeFormats.italic} />
          <ToolbarButton icon={Underline} command="underline" isActive={activeFormats.underline} />
          <ToolbarButton icon={Strikethrough} command="strikeThrough" isActive={activeFormats.strikethrough} />
          
          <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          
          <ToolbarButton icon={AlignLeft} command="justifyLeft" isActive={activeFormats.justifyLeft} />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" isActive={activeFormats.justifyCenter} />
          <ToolbarButton icon={AlignRight} command="justifyRight" isActive={activeFormats.justifyRight} />
          
          <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          
          <ToolbarButton icon={List} command="insertUnorderedList" isActive={activeFormats.insertUnorderedList} />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" isActive={activeFormats.insertOrderedList} />
        </div>
      )}

      {/* Editor Area */}
      <div 
        ref={editorRef}
        className="p-4 min-h-[200px] outline-none text-sm text-zinc-800 dark:text-zinc-200 prose dark:prose-invert max-w-none"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    </div>
  );
}