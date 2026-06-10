import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

export interface CodeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  language?: 'js' | 'ts' | 'html' | 'css' | 'json' | 'go'; /* @select|js|ts|html|css|json|go */
  theme?: 'dark' | 'light'; /* @select|dark|light */
  readOnly?: boolean;
  height?: string; 
  title?: string;
  onChange?: (value: string) => void;
}

export default function AdvancedCodeEditor({
  value = '// Write some code here...\nconsole.log("Hello, Rudra!");',
  language = 'js',
  theme = 'light',
  readOnly = false,
  height = '400px',
  title = 'index.ts',
  className = '',
  onChange,
  ...props
}: CodeEditorProps) {
  
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex flex-col w-full rounded-xl overflow-hidden border shadow-xl ${
        isDark ? 'border-zinc-800 bg-[#161b22]' : 'border-zinc-200 bg-[#f6f8fa]'
      } ${className}`} 
      style={{ height }}
      {...props}
    >
      {/* --- Mac-Style Window Header --- */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
        isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'
      }`}>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-sm"></div>
        </div>
        
        <div className={`text-xs font-mono font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {title}
        </div>

        <div className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-500'
        }`}>
          {language}
        </div>
      </div>

      {/* --- Editor Area --- */}
      <div className="flex-1 overflow-auto relative w-full" data-color-mode={theme}>
        <CodeEditor
          value={value}
          language={language}
          placeholder="Please enter code."
          onChange={(evn) => {
            if (!readOnly && onChange) {
              onChange(evn.target.value);
            }
          }}
          padding={16}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            fontSize: 14,
            backgroundColor: 'transparent',
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}