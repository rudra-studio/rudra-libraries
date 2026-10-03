import React from 'react';
import {
  Building2,
  Globe2,
  Link2,
  LoaderCircle,
  Save,
} from 'lucide-react';

export interface OrganizationFormPayload {
  name: string;
  slug: string;
  description: string;
  website: string;
}

export interface OrganizationFormProps {
  /**
   * Stable organization identifier.
   */
  organizationId?: string;

  /**
   * Organization name.
   */
  name?: string;

  /**
   * Organization/workspace slug.
   */
  slug?: string;

  /**
   * Organization description.
   *
   * @textarea
   */
  description?: string;

  /**
   * Organization website.
   */
  website?: string;

  /**
   * Form heading.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting form description.
   *
   * @translate
   */
  formDescription?: string;

  /**
   * Organization name field label.
   *
   * @translate
   */
  nameLabel?: string;

  /**
   * Slug field label.
   *
   * @translate
   */
  slugLabel?: string;

  /**
   * Description field label.
   *
   * @translate
   */
  descriptionLabel?: string;

  /**
   * Website field label.
   *
   * @translate
   */
  websiteLabel?: string;

  /**
   * Name field placeholder.
   *
   * @translate
   */
  namePlaceholder?: string;

  /**
   * Slug field placeholder.
   *
   * @translate
   */
  slugPlaceholder?: string;

  /**
   * Description field placeholder.
   *
   * @translate
   */
  descriptionPlaceholder?: string;

  /**
   * Website field placeholder.
   *
   * @translate
   */
  websitePlaceholder?: string;

  /**
   * Text shown before the slug.
   *
   * Example:
   * rudra.app/workspace/
   */
  slugPrefix?: string;

  /**
   * Save button label.
   *
   * @translate
   */
  submitLabel?: string;

  /**
   * Label displayed while saving.
   *
   * @translate
   */
  submittingLabel?: string;

  /**
   * Optional success message.
   *
   * @translate
   */
  successMessage?: string;

  /**
   * Optional form-level error.
   *
   * @translate
   */
  errorMessage?: string;

  /**
   * Whether the heading is displayed.
   */
  showHeader?: boolean;

  /**
   * Whether the slug field is displayed.
   */
  showSlug?: boolean;

  /**
   * Whether the description field is displayed.
   */
  showDescription?: boolean;

  /**
   * Whether the website field is displayed.
   */
  showWebsite?: boolean;

  /**
   * Whether the save action is displayed.
   */
  showSubmitAction?: boolean;

  /**
   * Whether the form is disabled.
   */
  disabled?: boolean;

  /**
   * Whether a save operation is running.
   */
  submitting?: boolean;

  /**
   * Accessible form label.
   */
  ariaLabel?: string;

  onNameChange?: (
    value: string,
  ) => void;

  onSlugChange?: (
    value: string,
  ) => void;

  onDescriptionChange?: (
    value: string,
  ) => void;

  onWebsiteChange?: (
    value: string,
  ) => void;

  onSubmit?: (
    organizationId: string,
    payload: OrganizationFormPayload,
  ) => void;

  /**
   * Utility classes exposed to Rudra.
   *
   * @type|class
   */
  className?: string;
}

const normalizeSlugInput = (
  value: string,
): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
};

const OrganizationForm: React.FC<
  OrganizationFormProps
> = ({
  organizationId = '',
  name = '',
  slug = '',
  description = '',
  website = '',

  title = 'Organization details',
  formDescription =
    'Update your organization information and workspace details.',

  nameLabel = 'Organization name',
  slugLabel = 'Workspace URL',
  descriptionLabel = 'Description',
  websiteLabel = 'Website',

  namePlaceholder =
    'Enter organization name',
  slugPlaceholder = 'your-workspace',
  descriptionPlaceholder =
    'Tell people a little about your organization...',
  websitePlaceholder =
    'https://example.com',

  slugPrefix = '',

  submitLabel = 'Save changes',
  submittingLabel = 'Saving...',
  successMessage = '',
  errorMessage = '',

  showHeader = true,
  showSlug = true,
  showDescription = true,
  showWebsite = true,
  showSubmitAction = true,

  disabled = false,
  submitting = false,

  ariaLabel =
    'Organization settings',

  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onWebsiteChange,
  onSubmit,

  className = '',
}) => {
  const formDisabled =
    disabled || submitting;

  const canSubmit =
    name.trim().length > 0 &&
    (!showSlug ||
      slug.trim().length > 0) &&
    !formDisabled;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.(
      organizationId,
      {
        name: name.trim(),
        slug: slug.trim(),
        description:
          description.trim(),
        website: website.trim(),
      },
    );
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
            border-b
            border-slate-200

            px-5
            py-4

            dark:border-slate-800

            sm:px-6
          "
        >
          <div
            className="
              flex
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
              <Building2
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h2
                className="
                  text-sm
                  font-semibold

                  text-slate-900

                  dark:text-slate-100
                "
              >
                {title}
              </h2>

              {formDescription && (
                <p
                  className="
                    mt-1
                    max-w-xl

                    text-xs
                    leading-5

                    text-slate-400

                    dark:text-slate-500
                  "
                >
                  {formDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fields */}
      <div
        className="
          space-y-5

          px-5
          py-5

          sm:px-6
          sm:py-6
        "
      >
        {/* Organization name */}
        <div>
          <label
            htmlFor={`${organizationId}-organization-name`}
            className="
              mb-1.5
              block

              text-xs
              font-medium

              text-slate-700

              dark:text-slate-300
            "
          >
            {nameLabel}
          </label>

          <div className="relative">
            <Building2
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
              id={`${organizationId}-organization-name`}
              type="text"
              value={name}
              disabled={formDisabled}
              placeholder={
                namePlaceholder
              }
              onChange={(event) =>
                onNameChange?.(
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

                dark:focus:border-indigo-500

                dark:disabled:bg-slate-900
              "
            />
          </div>
        </div>

        {/* Slug */}
        {showSlug && (
          <div>
            <label
              htmlFor={`${organizationId}-organization-slug`}
              className="
                mb-1.5
                block

                text-xs
                font-medium

                text-slate-700

                dark:text-slate-300
              "
            >
              {slugLabel}
            </label>

            <div
              className="
                flex
                min-w-0

                rounded-xl

                border
                border-slate-200

                bg-white

                transition-[border-color,box-shadow]

                focus-within:border-indigo-400
                focus-within:ring-4
                focus-within:ring-indigo-500/10

                dark:border-slate-800
                dark:bg-slate-950

                dark:focus-within:border-indigo-500
              "
            >
              {slugPrefix && (
                <div
                  className="
                    hidden
                    shrink-0
                    items-center

                    border-r
                    border-slate-200

                    bg-slate-50

                    px-3

                    text-xs

                    text-slate-400

                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:text-slate-500

                    sm:flex
                  "
                >
                  <Link2
                    size={13}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="
                      mr-1.5
                      shrink-0
                    "
                  />

                  {slugPrefix}
                </div>
              )}

              <input
                id={`${organizationId}-organization-slug`}
                type="text"
                value={slug}
                disabled={formDisabled}
                placeholder={
                  slugPlaceholder
                }
                onChange={(event) =>
                  onSlugChange?.(
                    normalizeSlugInput(
                      event.target
                        .value,
                    ),
                  )
                }
                className="
                  h-10
                  min-w-0
                  flex-1

                  rounded-xl

                  bg-transparent

                  px-3

                  text-sm

                  text-slate-900

                  outline-none

                  placeholder:text-slate-400

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </div>

            {slugPrefix &&
              slug && (
                <p
                  className="
                    mt-1.5

                    truncate

                    text-[10px]

                    text-slate-400

                    dark:text-slate-500

                    sm:hidden
                  "
                >
                  {slugPrefix}
                  {slug}
                </p>
              )}
          </div>
        )}

        {/* Description */}
        {showDescription && (
          <div>
            <label
              htmlFor={`${organizationId}-organization-description`}
              className="
                mb-1.5
                block

                text-xs
                font-medium

                text-slate-700

                dark:text-slate-300
              "
            >
              {descriptionLabel}
            </label>

            <textarea
              id={`${organizationId}-organization-description`}
              value={description}
              disabled={formDisabled}
              placeholder={
                descriptionPlaceholder
              }
              rows={4}
              onChange={(event) =>
                onDescriptionChange?.(
                  event.target.value,
                )
              }
              className="
                block
                w-full
                resize-y

                rounded-xl

                border
                border-slate-200

                bg-white

                px-3
                py-2.5

                text-sm
                leading-5

                text-slate-900

                outline-none

                transition-[border-color,box-shadow]

                placeholder:text-slate-400

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

                dark:focus:border-indigo-500

                dark:disabled:bg-slate-900
              "
            />
          </div>
        )}

        {/* Website */}
        {showWebsite && (
          <div>
            <label
              htmlFor={`${organizationId}-organization-website`}
              className="
                mb-1.5
                block

                text-xs
                font-medium

                text-slate-700

                dark:text-slate-300
              "
            >
              {websiteLabel}
            </label>

            <div className="relative">
              <Globe2
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
                id={`${organizationId}-organization-website`}
                type="url"
                value={website}
                disabled={formDisabled}
                placeholder={
                  websitePlaceholder
                }
                onChange={(event) =>
                  onWebsiteChange?.(
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

                  dark:focus:border-indigo-500

                  dark:disabled:bg-slate-900
                "
              />
            </div>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="
              rounded-xl

              border
              border-rose-200

              bg-rose-50

              px-3.5
              py-3

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

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="
              rounded-xl

              border
              border-emerald-200

              bg-emerald-50

              px-3.5
              py-3

              text-xs
              leading-5

              text-emerald-700

              dark:border-emerald-500/20
              dark:bg-emerald-500/10
              dark:text-emerald-300
            "
          >
            {successMessage}
          </div>
        )}
      </div>

      {/* Footer */}
      {showSubmitAction && (
        <div
          className="
            flex
            items-center
            justify-end

            border-t
            border-slate-200

            bg-slate-50/50

            px-5
            py-3.5

            dark:border-slate-800
            dark:bg-slate-900/30

            sm:px-6
          "
        >
          <button
            type="submit"
            disabled={!canSubmit}
            className="
              inline-flex
              min-h-10
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
                <LoaderCircle
                  size={14}
                  strokeWidth={1.9}
                  aria-hidden="true"
                  className="
                    animate-spin
                  "
                />

                {submittingLabel}
              </>
            ) : (
              <>
                <Save
                  size={14}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                {submitLabel}
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default OrganizationForm;