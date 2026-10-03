import React from 'react';
import {
  ChevronDown,
  Mail,
  Send,
  UserPlus,
  X,
} from 'lucide-react';

export interface InviteMemberRole {
  label: string;
  value: string;
  description?: string;
}

export interface InviteMemberPayload {
  email: string;
  role: string;
}

export interface InviteMemberFormProps {
  /**
   * Current email value.
   */
  email?: string;

  /**
   * Currently selected role value.
   */
  role?: string;

  /**
   * Available role options.
   *
   * @type|complex
   * @schema {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "label": { "type": "string" },
   *       "value": { "type": "string" },
   *       "description": { "type": "string" }
   *     },
   *     "required": ["label", "value"]
   *   }
   * }
   */
  roles?: InviteMemberRole[];

  /**
   * Form heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting text.
   *
   * @translate
   */
  description?: string;

  /**
   * Email field label.
   *
   * @translate
   */
  emailLabel?: string;

  /**
   * Role field label.
   *
   * @translate
   */
  roleLabel?: string;

  /**
   * Email placeholder.
   *
   * @translate
   */
  emailPlaceholder?: string;

  /**
   * Role placeholder.
   *
   * @translate
   */
  rolePlaceholder?: string;

  /**
   * Submit button label.
   *
   * @translate
   */
  submitLabel?: string;

  /**
   * Whether the heading area is visible.
   */
  showHeader?: boolean;

  /**
   * Whether the cancel action is visible.
   */
  showCancelAction?: boolean;

  /**
   * Whether the complete form is disabled.
   */
  disabled?: boolean;

  /**
   * Whether an invitation request is in progress.
   */
  submitting?: boolean;

  /**
   * Optional external error message.
   *
   * The actual API/invitation logic should
   * determine this value.
   *
   * @translate
   */
  errorMessage?: string;

  /**
   * Accessible form label.
   */
  ariaLabel?: string;

  /**
   * Emits the current email value.
   */
  onEmailChange?: (email: string) => void;

  /**
   * Emits the selected role value.
   */
  onRoleChange?: (role: string) => void;

  /**
   * Emits the invitation payload.
   */
  onSubmit?: (
    payload: InviteMemberPayload,
  ) => void;

  /**
   * Requests cancellation/closure.
   */
  onCancel?: () => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const InviteMemberForm: React.FC<
  InviteMemberFormProps
> = ({
  email = '',
  role = '',
  roles = [],
  title = 'Invite team member',
  description =
    'Invite someone to join your workspace.',
  emailLabel = 'Email address',
  roleLabel = 'Role',
  emailPlaceholder = 'name@company.com',
  rolePlaceholder = 'Select a role',
  submitLabel = 'Send invitation',
  showHeader = true,
  showCancelAction = true,
  disabled = false,
  submitting = false,
  errorMessage = '',
  ariaLabel = 'Invite team member',
  onEmailChange,
  onRoleChange,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const isDisabled =
    disabled || submitting;

  const selectedRole =
    roles.find(
      (item) =>
        item.value === role,
    );

  const canSubmit =
    Boolean(email.trim()) &&
    Boolean(role) &&
    !isDisabled;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      email: email.trim(),
      role,
    });
  };

  return (
    <form
      aria-label={ariaLabel}
      onSubmit={handleSubmit}
      className={`
        min-w-0

        overflow-hidden

        rounded-2xl

        border
        border-slate-200

        bg-white

        shadow-sm
        shadow-slate-950/[0.025]

        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-black/10

        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3

            border-b
            border-slate-200

            px-4
            py-4

            dark:border-slate-800

            sm:px-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-3
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                bg-indigo-50

                text-indigo-600

                dark:bg-indigo-500/10
                dark:text-indigo-300
              "
            >
              <UserPlus
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h3
                className="
                  text-sm
                  font-semibold

                  text-slate-900

                  dark:text-slate-100
                "
              >
                {title}
              </h3>

              {description && (
                <p
                  className="
                    mt-1

                    text-xs
                    leading-5

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {showCancelAction && (
            <button
              type="button"
              disabled={isDisabled}
              aria-label="Close invitation form"
              onClick={onCancel}
              className="
                flex
                h-8
                w-8
                shrink-0
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

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:text-slate-500
                dark:hover:bg-slate-900
                dark:hover:text-slate-200
              "
            >
              <X
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      )}

      {/* Fields */}
      <div
        className="
          space-y-5

          px-4
          py-5

          sm:px-5
        "
      >
        {/* Email */}
        <div>
          <label
            htmlFor="invite-member-email"
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {emailLabel}
          </label>

          <div className="relative">
            <Mail
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                left-3
                top-1/2

                -translate-y-1/2

                text-slate-400

                dark:text-slate-500
              "
            />

            <input
              id="invite-member-email"
              type="email"
              value={email}
              disabled={isDisabled}
              autoComplete="email"
              placeholder={
                emailPlaceholder
              }
              onChange={(event) =>
                onEmailChange?.(
                  event.target.value,
                )
              }
              className="
                h-10
                w-full

                rounded-xl

                border
                border-slate-200

                bg-white

                pl-9
                pr-3

                text-sm

                text-slate-900

                outline-none

                transition-[border-color,box-shadow]

                placeholder:text-slate-400

                hover:border-slate-300

                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-500/10

                disabled:cursor-not-allowed
                disabled:bg-slate-50
                disabled:opacity-60

                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-100
                dark:placeholder:text-slate-600

                dark:hover:border-slate-700

                dark:focus:border-indigo-500
                dark:focus:ring-indigo-500/10

                dark:disabled:bg-slate-900
              "
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="invite-member-role"
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {roleLabel}
          </label>

          <div className="relative">
            <select
              id="invite-member-role"
              value={role}
              disabled={isDisabled}
              onChange={(event) =>
                onRoleChange?.(
                  event.target.value,
                )
              }
              className="
                h-10
                w-full

                appearance-none

                rounded-xl

                border
                border-slate-200

                bg-white

                pl-3
                pr-9

                text-sm

                text-slate-700

                outline-none

                transition-[border-color,box-shadow]

                hover:border-slate-300

                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-500/10

                disabled:cursor-not-allowed
                disabled:bg-slate-50
                disabled:opacity-60

                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-300

                dark:hover:border-slate-700

                dark:focus:border-indigo-500
                dark:focus:ring-indigo-500/10

                dark:disabled:bg-slate-900
              "
            >
              <option value="">
                {rolePlaceholder}
              </option>

              {roles.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ),
              )}
            </select>

            <ChevronDown
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                right-3
                top-1/2

                -translate-y-1/2

                text-slate-400

                dark:text-slate-500
              "
            />
          </div>

          {selectedRole?.description && (
            <p
              className="
                mt-1.5

                text-[11px]
                leading-4

                text-slate-400

                dark:text-slate-500
              "
            >
              {
                selectedRole.description
              }
            </p>
          )}
        </div>

        {/* External error */}
        {errorMessage && (
          <div
            role="alert"
            className="
              rounded-xl

              border
              border-rose-200

              bg-rose-50

              px-3
              py-2.5

              text-xs
              leading-5

              text-rose-700

              dark:border-rose-500/20
              dark:bg-rose-500/10
              dark:text-rose-300
            "
          >
            {errorMessage}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-end
          gap-2

          border-t
          border-slate-200

          bg-slate-50/60

          px-4
          py-3

          dark:border-slate-800
          dark:bg-slate-900/30

          sm:px-5
        "
      >
        {showCancelAction && (
          <button
            type="button"
            disabled={isDisabled}
            onClick={onCancel}
            className="
              inline-flex
              h-9
              items-center
              justify-center

              rounded-xl

              px-3

              text-xs
              font-semibold

              text-slate-600

              transition-colors

              hover:bg-slate-100
              hover:text-slate-900

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-slate-100
            "
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="
            inline-flex
            h-9
            items-center
            justify-center
            gap-2

            rounded-xl

            bg-indigo-600

            px-4

            text-xs
            font-semibold

            text-white

            shadow-sm
            shadow-indigo-600/20

            transition-[background-color,transform]

            hover:bg-indigo-700

            active:scale-[0.98]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            focus-visible:ring-offset-2

            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:shadow-none

            dark:bg-indigo-500
            dark:hover:bg-indigo-400
            dark:focus-visible:ring-indigo-400
            dark:focus-visible:ring-offset-slate-950
          "
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="
                  h-3.5
                  w-3.5

                  animate-spin

                  rounded-full

                  border-2
                  border-white/30
                  border-t-white
                "
              />

              Sending...
            </>
          ) : (
            <>
              <Send
                size={14}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InviteMemberForm;