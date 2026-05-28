import React, { useState } from 'react';

export type FormField = {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // Used if type === 'select'
};

export type FormStep = {
  title: string;
  fields: FormField[];
};

export interface JSONFormProps extends React.HTMLAttributes<HTMLFormElement> {
  schema?: FormStep[]; /* @widget|generic-array-builder */
  submitLabel?: string; /* @translate */
  nextLabel?: string; /* @translate */
  prevLabel?: string; /* @translate */
  customColor?: string; /* @color */
}

export default function JSONForm({
  schema = [],
  submitLabel = 'Submit',
  nextLabel = 'Next',
  prevLabel = 'Previous',
  customColor = '#3b82f6',
  className = '',
  ...props
}: JSONFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep < schema.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const activeStep = schema[currentStep];
  const isMultiStep = schema.length > 1;

  if (!activeStep || schema.length === 0) return null;

  return (
    <form className={`w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 ${className}`} {...props}>

      {/* Progress Header */}
      {isMultiStep && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{activeStep.title}</h3>
            <span className="text-sm text-zinc-500">Step {currentStep + 1} of {schema.length}</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / schema.length) * 100}%`, backgroundColor: customColor }}
            />
          </div>
        </div>
      )}

      {/* Dynamic Fields */}
      <div className="flex flex-col gap-5 mb-8">
        {activeStep.fields.map(field => {
          const commonClasses = "w-full py-2 px-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:border-transparent transition-colors shadow-sm";

          return (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={commonClasses}
                  style={{ '--tw-ring-color': customColor } as React.CSSProperties}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={commonClasses}
                  style={{ '--tw-ring-color': customColor } as React.CSSProperties}
                >
                  <option value="" disabled>Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  required={field.required}
                  checked={formData[field.id] || false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-current focus:ring-2"
                  style={{ color: customColor }}
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={commonClasses}
                  style={{ '--tw-ring-color': customColor } as React.CSSProperties}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        {isMultiStep && currentStep > 0 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            {prevLabel}
          </button>
        ) : <div />}

        {isMultiStep && currentStep < schema.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-opacity hover:opacity-90 shadow-sm"
            style={{ backgroundColor: customColor }}
          >
            {nextLabel}
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white rounded-md transition-opacity hover:opacity-90 shadow-sm"
            style={{ backgroundColor: customColor }}
          >
            {submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}