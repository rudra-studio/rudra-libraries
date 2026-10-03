import React, { useEffect } from 'react';
import {
  Building2,
  Mail,
  MoreHorizontal,
  UserRound,
  X,
} from 'lucide-react';

export interface LeadDrawerProps {
  /**
   * Whether the drawer is visible.
   */
  open?: boolean;

  /**
   * Stable lead identifier.
   */
  leadId?: string;

  /**
   * Lead/contact name.
   */
  name?: string;

  /**
   * Company name.
   */
  company?: string;

  /**
   * Optional job title.
   */
  jobTitle?: string;

  /**
   * Lead avatar URL.
   */
  avatarUrl?: string;

  /**
   * Initials displayed when no avatar exists.
   */
  initials?: string;

  /**
   * Optional status/stage label.
   */
  status?: string;

  /**
   * Status tone.
   *
   * @select|slate|blue|indigo|violet|amber|emerald|rose
   */
  statusTone?:
    | 'slate'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'amber'
    | 'emerald'
    | 'rose';

  /**
   * Optional formatted opportunity value.
   *
   * Example: "₹2.4L"
   */
  value?: string;

  /**
   * Optional email address.
   */
  email?: string;

  /**
   * Drawer width on larger screens.
   *
   * @select|medium|large|wide
   */
  size?: 'medium' | 'large' | 'wide';

  /**
   * Whether clicking the backdrop closes the drawer.
   */
  closeOnBackdrop?: boolean;

  /**
   * Whether pressing Escape closes the drawer.
   */
  closeOnEscape?: boolean;

  /**
   * Show the email action.
   */
  showEmailAction?: boolean;

  /**
   * Show the options action.
   */
  showMenuAction?: boolean;

  /**
   * Accessible drawer label.
   */
  ariaLabel?: string;

  /**
   * Content rendered inside the drawer.
   */
  children?: React.ReactNode;

  /**
   * Requests that the drawer be closed.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Emits the lead ID when email is selected.
   */
  onEmailClick?: (leadId: string) => void;

  /**
   * Emits the lead ID when menu is selected.
   */
  onMenuClick?: (leadId: string) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const WIDTHS: Record<
  NonNullable<LeadDrawerProps['size']>,
  string
> = {
  medium: 'sm:max-w-lg',
  large: 'sm:max-w-xl',
  wide: 'sm:max-w-2xl',
};

const STATUS_STYLES: Record<
  NonNullable<LeadDrawerProps['statusTone']>,
  string
> = {
  slate: `
    bg-slate-100 text-slate-600
    dark:bg-slate-800 dark:text-slate-300
  `,
  blue: `
    bg-blue-50 text-blue-700
    dark:bg-blue-500/10 dark:text-blue-300
  `,
  indigo: `
    bg-indigo-50 text-indigo-700
    dark:bg-indigo-500/10 dark:text-indigo-300
  `,
  violet: `
    bg-violet-50 text-violet-700
    dark:bg-violet-500/10 dark:text-violet-300
  `,
  amber: `
    bg-amber-50 text-amber-700
    dark:bg-amber-500/10 dark:text-amber-300
  `,
  emerald: `
    bg-emerald-50 text-emerald-700
    dark:bg-emerald-500/10 dark:text-emerald-300
  `,
  rose: `
    bg-rose-50 text-rose-700
    dark:bg-rose-500/10 dark:text-rose-300
  `,
};

const getInitials = (value?: string): string => {
  if (!value) return '';

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const LeadDrawer: React.FC<LeadDrawerProps> = ({
  open = false,
  leadId = '',
  name = '',
  company = '',
  jobTitle = '',
  avatarUrl = '',
  initials = '',
  status = '',
  statusTone = 'slate',
  value = '',
  email = '',
  size = 'large',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showEmailAction = true,
  showMenuAction = true,
  ariaLabel = '',
  children,
  onOpenChange,
  onEmailClick,
  onMenuClick,
  className = '',
}) => {
  const displayInitials =
    initials || getInitials(name);

  useEffect(() => {
    if (
      !open ||
      !closeOnEscape ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    open,
    closeOnEscape,
    onOpenChange,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
      "
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close lead details"
        tabIndex={-1}
        onClick={() => {
          if (closeOnBackdrop) {
            onOpenChange?.(false);
          }
        }}
        className="
          absolute
          inset-0

          h-full
          w-full

          cursor-default

          bg-slate-950/25
          backdrop-blur-[2px]

          motion-safe:animate-[fadeIn_160ms_ease-out]

          dark:bg-black/50
        "
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={
          ariaLabel ||
          (name
            ? `${name} lead details`
            : 'Lead details')
        }
        className={`
          absolute
          inset-y-0
          right-0

          flex
          w-full
          flex-col

          border-l
          border-slate-200

          bg-white

          shadow-2xl
          shadow-slate-950/10

          motion-safe:animate-[slideInRight_220ms_cubic-bezier(0.22,1,0.36,1)]

          dark:border-slate-800
          dark:bg-slate-950
          dark:shadow-black/30

          ${WIDTHS[size]}
          ${className}
        `}
      >
        {/* Header */}
        <header
          className="
            shrink-0

            border-b
            border-slate-200

            px-4
            py-4

            dark:border-slate-800

            sm:px-5
          "
        >
          {/* Top controls */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]

                text-slate-400

                dark:text-slate-500
              "
            >
              Lead details
            </span>

            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              {showEmailAction &&
                email && (
                  <button
                    type="button"
                    aria-label={`Email ${
                      name || 'lead'
                    }`}
                    onClick={() =>
                      onEmailClick?.(
                        leadId,
                      )
                    }
                    className="
                      flex
                      h-9 w-9
                      items-center
                      justify-center

                      rounded-xl

                      text-slate-400

                      transition-colors

                      hover:bg-indigo-50
                      hover:text-indigo-600

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-indigo-500

                      dark:text-slate-500
                      dark:hover:bg-indigo-500/10
                      dark:hover:text-indigo-300
                    "
                  >
                    <Mail
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>
                )}

              {showMenuAction && (
                <button
                  type="button"
                  aria-label={`More options for ${
                    name || 'lead'
                  }`}
                  onClick={() =>
                    onMenuClick?.(
                      leadId,
                    )
                  }
                  className="
                    flex
                    h-9 w-9
                    items-center
                    justify-center

                    rounded-xl

                    text-slate-400

                    transition-colors

                    hover:bg-slate-100
                    hover:text-slate-700

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500

                    dark:text-slate-500
                    dark:hover:bg-slate-900
                    dark:hover:text-slate-200
                  "
                >
                  <MoreHorizontal
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              )}

              <button
                type="button"
                aria-label="Close lead details"
                onClick={() =>
                  onOpenChange?.(
                    false,
                  )
                }
                className="
                  flex
                  h-9 w-9
                  items-center
                  justify-center

                  rounded-xl

                  text-slate-400

                  transition-colors

                  hover:bg-slate-100
                  hover:text-slate-700

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-indigo-500

                  dark:text-slate-500
                  dark:hover:bg-slate-900
                  dark:hover:text-slate-200
                "
              >
                <X
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Identity */}
          <div
            className="
              mt-4

              flex
              min-w-0
              items-start
              gap-3
            "
          >
            <span
              className="
                flex
                h-12 w-12
                shrink-0
                items-center
                justify-center
                overflow-hidden

                rounded-2xl

                bg-gradient-to-br
                from-indigo-50
                to-violet-100

                text-sm
                font-semibold
                text-indigo-700

                ring-1
                ring-indigo-100

                dark:from-indigo-500/15
                dark:to-violet-500/10
                dark:text-indigo-300
                dark:ring-indigo-500/20
              "
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : displayInitials ? (
                displayInitials
              ) : (
                <UserRound
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </span>

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {name && (
                  <h2
                    className="
                      min-w-0
                      truncate

                      text-lg
                      font-semibold
                      tracking-[-0.025em]

                      text-slate-950

                      dark:text-white
                    "
                  >
                    {name}
                  </h2>
                )}

                {status && (
                  <span
                    className={`
                      inline-flex
                      shrink-0
                      items-center
                      gap-1.5

                      rounded-full

                      px-2
                      py-1

                      text-[10px]
                      font-semibold

                      ${STATUS_STYLES[statusTone]}
                    `}
                  >
                    <span
                      aria-hidden="true"
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-current
                        opacity-70
                      "
                    />

                    {status}
                  </span>
                )}
              </div>

              {(company ||
                jobTitle) && (
                <div
                  className="
                    mt-1

                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-1.5

                    text-xs
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {company && (
                    <>
                      <Building2
                        size={13}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {company}
                      </span>
                    </>
                  )}

                  {company &&
                    jobTitle && (
                      <span
                        aria-hidden="true"
                        className="
                          text-slate-300
                          dark:text-slate-700
                        "
                      >
                        ·
                      </span>
                    )}

                  {jobTitle && (
                    <span className="truncate">
                      {jobTitle}
                    </span>
                  )}
                </div>
              )}

              {value && (
                <div
                  className="
                    mt-2

                    text-sm
                    font-semibold

                    text-slate-800

                    dark:text-slate-200
                  "
                >
                  {value}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Composable content */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto

            [scrollbar-width:thin]
          "
        >
          {children ? (
            children
          ) : (
            <div
              className="
                flex
                min-h-[240px]
                items-center
                justify-center

                px-6

                text-center
                text-sm
                text-slate-400

                dark:text-slate-500
              "
            >
              Select or configure
              drawer content.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default LeadDrawer;