import React from 'react';
import {
  Search,
  X,
} from 'lucide-react';

export interface LeadSearchProps {
  /**
   * Current search value.
   */
  value?: string;

  /**
   * Input placeholder.
   *
   * @translate
   */
  placeholder?: string;

  /**
   * Accessible label for the search input.
   */
  ariaLabel?: string;

  /**
   * Whether the search input is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the clear button should be displayed
   * when a value exists.
   */
  showClear?: boolean;

  /**
   * Input size.
   *
   * @select|small|default|large
   */
  size?: 'small' | 'default' | 'large';

  /**
   * Visual width behavior.
   *
   * @select|auto|full
   */
  width?: 'auto' | 'full';

  /**
   * Emits the current value whenever it changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Emits the current search value when the
   * form is submitted.
   */
  onSubmit?: (value: string) => void;

  /**
   * Called when the clear action is selected.
   */
  onClear?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const SIZES: Record<
  NonNullable<LeadSearchProps['size']>,
  {
    input: string;
    icon: number;
    clearButton: string;
  }
> = {
  small: {
    input: `
      h-9
      pl-9
      pr-9
      text-xs
    `,
    icon: 15,
    clearButton: 'h-7 w-7',
  },

  default: {
    input: `
      h-10
      pl-10
      pr-10
      text-sm
    `,
    icon: 16,
    clearButton: 'h-7 w-7',
  },

  large: {
    input: `
      h-12
      pl-11
      pr-11
      text-sm
    `,
    icon: 18,
    clearButton: 'h-8 w-8',
  },
};

const LeadSearch: React.FC<
  LeadSearchProps
> = ({
  value = '',
  placeholder = 'Search leads...',
  ariaLabel = 'Search leads',
  disabled = false,
  showClear = true,
  size = 'default',
  width = 'full',
  onValueChange,
  onSubmit,
  onClear,
  className = '',
}) => {
  const sizeConfig = SIZES[size];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onValueChange?.(
      event.target.value,
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (disabled) return;

    onSubmit?.(value);
  };

  const handleClear = () => {
    if (disabled) return;

    /*
     * Emit the empty value as well so a normal
     * Rudra value binding is immediately updated.
     */
    onValueChange?.('');
    onClear?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`
        min-w-0

        ${
          width === 'full'
            ? 'w-full'
            : 'w-auto'
        }

        ${className}
      `}
    >
      <div
        className="
          group
          relative
          min-w-0
        "
      >
        {/* Search icon */}
        <span
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0

            flex
            items-center
            pl-3

            text-slate-400

            transition-colors

            group-focus-within:text-indigo-500

            dark:text-slate-500
            dark:group-focus-within:text-indigo-400
          "
        >
          <Search
            size={sizeConfig.icon}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        {/* Input */}
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          onChange={handleChange}
          className={`
            block
            w-full
            min-w-0

            rounded-xl

            border
            border-slate-200

            bg-white

            font-normal
            text-slate-900

            outline-none

            transition-[border-color,box-shadow,background-color]

            placeholder:text-slate-400

            hover:border-slate-300

            focus:border-indigo-400
            focus:ring-4
            focus:ring-indigo-500/10

            disabled:cursor-not-allowed
            disabled:bg-slate-50
            disabled:text-slate-400
            disabled:opacity-70

            dark:border-slate-800
            dark:bg-slate-950
            dark:text-slate-100
            dark:placeholder:text-slate-600

            dark:hover:border-slate-700

            dark:focus:border-indigo-500
            dark:focus:ring-indigo-500/10

            dark:disabled:bg-slate-900

            ${sizeConfig.input}
          `}
        />

        {/* Clear */}
        {showClear &&
          value &&
          !disabled && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className={`
                absolute
                right-1.5
                top-1/2

                flex
                -translate-y-1/2
                items-center
                justify-center

                rounded-lg

                text-slate-400

                transition-colors

                hover:bg-slate-100
                hover:text-slate-700

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500

                dark:text-slate-500
                dark:hover:bg-slate-800
                dark:hover:text-slate-200

                ${sizeConfig.clearButton}
              `}
            >
              <X
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </button>
          )}
      </div>
    </form>
  );
};

export default LeadSearch;