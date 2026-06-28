import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface TabItem {
  id: string | number;
  tabName: string;
  node?: React.ReactNode | ((context: any) => React.ReactNode);
}

export interface DataTabsProps {
  /** Array defining the tabs and their specific content */
  tabs?: TabItem[]; /* @complex|{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"tabName":{"type":"string"},"node":{"type":"nodeFunction"}}}} */

  /** Global template fallback if a specific tab doesn't have a node defined */
  templateContent?: (payload: { activeTab: TabItem; index: number }) => React.ReactNode; /* @nodeFunction */

  variant?: 'top' | 'bottom' | 'dashboard'; /* @select|top|bottom|dashboard */
  className?: string;
}

export const DataTabs: React.FC<DataTabsProps> = ({
  tabs = [],
  templateContent,
  variant = 'top',
  className = ''
}) => {
  // Select the first tab by default
  const [activeTabId, setActiveTabId] = useState<string | number>(tabs[0]?.id || 0);

  // Dashboard Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!tabs || tabs.length === 0) return null;

  const activeIndex = tabs.findIndex(t => t.id === activeTabId) !== -1 ? tabs.findIndex(t => t.id === activeTabId) : 0;
  const activeTab = tabs[activeIndex];

  // --- COMPONENT PORTIONS ---

  // The scrollable list of buttons (used in Top and Bottom variants)
  const HorizontalTabList = () => (
    <div className="flex w-full overflow-x-auto hide-scrollbar border-b border-slate-200 bg-white">
      <div className="flex px-4 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.tabName}
            </button>
          );
        })}
      </div>
    </div>
  );

  // The content render area
  const TabContentArea = () => {
    let content: React.ReactNode = null;

    // 1. Prioritize the specific node function/element attached to the tab
    if (typeof activeTab.node === 'function') {
      content = activeTab.node({ activeTab, index: activeIndex, _builderIndex: activeIndex });
    } else if (activeTab.node) {
      content = activeTab.node;
    }
    // 2. Fallback to the global generic template if provided
    else if (templateContent) {
      content = templateContent({ activeTab, index: activeIndex });
    }
    // 3. Ultimate fallback (empty state for builder)
    else {
      content = (
        <div className="p-8 text-center text-slate-400 font-mono text-sm border-2 border-dashed border-slate-200 rounded-xl">
          Drop Content for {activeTab.tabName}
        </div>
      );
    }

    return (
      <div className="flex-1 w-full p-4 bg-slate-50 overflow-y-auto">
        {content}
      </div>
    );
  };

  // --- RENDER LOGIC BASED ON VARIANT ---

  // 1. TOP VARIANT
  if (variant === 'top') {
    return (
      <div className={`flex flex-col w-full h-full border border-slate-200 rounded-xl overflow-hidden ${className}`}>
        <HorizontalTabList />
        <TabContentArea />
      </div>
    );
  }

  // 2. BOTTOM VARIANT
  if (variant === 'bottom') {
    return (
      <div className={`flex flex-col w-full h-full border border-slate-200 rounded-xl overflow-hidden ${className}`}>
        <TabContentArea />
        {/* Border is on top of the tabs list for bottom layout */}
        <div className="border-t border-slate-200"><HorizontalTabList /></div>
      </div>
    );
  }

  // 3. DASHBOARD VARIANT
  // Features a vertical sidebar. On mobile, it hides behind a hamburger menu.
  return (
    <div className={`flex flex-col md:flex-row w-full h-full min-h-[400px] border border-slate-200 rounded-xl overflow-hidden relative ${className}`}>

      {/* Mobile Topbar (Only visible on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <span className="font-bold text-slate-800">{activeTab.tabName}</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-md text-slate-600">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* The Sidebar (Vertical Tab List) */}
      <div className={`
        absolute md:relative z-20 w-64 h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col p-4 gap-2 h-full overflow-y-auto hide-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 hidden md:block">
            Dashboard Menu
          </div>
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setIsSidebarOpen(false); // Auto-close on mobile after selection
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'bg-transparent text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {tab.tabName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden absolute inset-0 bg-slate-900/20 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full bg-slate-50 h-full relative z-0">
        <TabContentArea />
      </div>

    </div>
  );
};

export default DataTabs;