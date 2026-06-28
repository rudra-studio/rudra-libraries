import React, { useState } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';

export interface AccordionItem {
  id: string | number;
  [key: string]: any; // Allows any generic data payload
}

export interface DataAccordionProps {
  /** The data array to generate accordion panels */
  items?: AccordionItem[];
  
  /** Template for the visible header */
  templateTitle?: (payload: { item: any; index: number }) => React.ReactNode; /* @nodeFunction */
  
  /** Template for the hidden content */
  templateContent?: (payload: { item: any; index: number }) => React.ReactNode; /* @nodeFunction */
  
  /** Allow multiple panels to be open at once */
  allowMultiple?: boolean;
  
  // Theme Controls
  theme?: 'light' | 'dark'; /* @select|light|dark */
  enableThemeToggle?: boolean; 
  
  className?: string;
}

export const DataAccordion: React.FC<DataAccordionProps> = ({
  items = [],
  templateTitle,
  templateContent,
  allowMultiple = false,
  theme: initialTheme = 'light',
  enableThemeToggle = false,
  className = ''
}) => {
  const [openIds, setOpenIds] = useState<Set<string | number>>(new Set());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(initialTheme);

  const togglePanel = (id: string | number) => {
    setOpenIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) newSet.clear(); // Close others if single-mode
        newSet.add(id);
      }
      return newSet;
    });
  };

  // --- Theme Style Dictionaries ---
  const styles = {
    container: currentTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200',
    item: currentTheme === 'dark' ? 'border-b border-slate-800' : 'border-b border-slate-200',
    buttonHover: currentTheme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-50',
    icon: currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    contentBg: currentTheme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50/50',
    text: currentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800',
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full border rounded-2xl overflow-hidden transition-colors duration-300 ${styles.container} ${className}`}>
      
      {/* Optional In-Component Theme Toggle (For Builder / User flexibility) */}
      {enableThemeToggle && (
        <div className={`flex justify-end p-2 border-b ${styles.item}`}>
          <button 
            onClick={() => setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      )}

      {/* Accordion List */}
      <div className="flex flex-col">
        {items.map((item, index) => {
          const isOpen = openIds.has(item.id || index);

          return (
            <div key={item.id || index} className={`last:border-b-0 ${styles.item}`}>
              
              {/* ACCORDION HEADER (Triggers open/close) */}
              <button
                onClick={() => togglePanel(item.id || index)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${styles.buttonHover} ${styles.text}`}
              >
                <div className="flex-1 text-left">
                  {templateTitle ? templateTitle({ item, index }) : <span className="font-medium">Item {index + 1}</span>}
                </div>
                <ChevronDown 
                  size={20} 
                  className={`transform transition-transform duration-300 shrink-0 ml-4 ${styles.icon} ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
              </button>

              {/* ACCORDION CONTENT (Animated expanding div) */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className={`p-4 ${styles.contentBg}`}>
                    {templateContent ? templateContent({ item, index }) : <div className="text-sm opacity-70">Empty Content</div>}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataAccordion;