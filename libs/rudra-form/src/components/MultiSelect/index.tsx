import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

export type MultiSelectOption = {
  label: string;
  value: string;
};

export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string; /* @translate */
  placeholder?: string; /* @translate */
  options?: MultiSelectOption[];
  maxSelected?: number;
  customColor?: string; /* @color */
}

export default function MultiSelect({
  label = 'Select multiple items',
  placeholder = 'Search and select...',
  options,
  maxSelected = 10,
  customColor = '#3b82f6',
  className = '',
  ...props
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MultiSelectOption[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) &&
    !selected.some(s => s.value === opt.value)
  );

  const toggleSelect = (option: MultiSelectOption) => {
    if (selected.some(s => s.value === option.value)) {
      setSelected(selected.filter(s => s.value !== option.value));
    } else if (selected.length < maxSelected) {
      setSelected([...selected, option]);
      setSearch(''); // Clear search on select
    }
  };

  const removeOption = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    setSelected(selected.filter(s => s.value !== value));
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={wrapperRef} {...props}>
      {label && <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{label}</label>}

      <div
        onClick={() => setIsOpen(true)}
        className="min-h-[40px] w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-offset-1 dark:focus-within:ring-offset-zinc-950 transition-colors cursor-text flex flex-wrap gap-1.5 items-center"
        style={{ '--tw-ring-color': customColor } as React.CSSProperties}
      >
        {selected.map(opt => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
          >
            {opt.label}
            <button
              onClick={(e) => removeOption(e, opt.value)}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <LucideIcons.X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
        />

        <div className="absolute right-3 text-zinc-400 pointer-events-none">
          <LucideIcons.ChevronDown size={16} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg z-50">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500 text-center">No options found</div>
          ) : (
            filteredOptions.map(opt => (
              <div
                key={opt.value}
                onClick={() => toggleSelect(opt)}
                className="px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}