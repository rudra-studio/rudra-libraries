import React, { useState } from 'react';
import Form from '../Form';
import Input from '../Input';
import Select from '../Select';
import Checkbox from '../Checkbox';
import FieldWrapper from '../FieldWrapper';
import { useRudraForm } from '../RudraFormContext';

export type FormField = {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[]; 
};

export type FormStep = {
  title: string;
  fields: FormField[];
};

export interface JSONFormProps {
  schema?: FormStep[]; /* @widget|generic-array-builder */
  submitLabel?: string; /* @translate */
  nextLabel?: string; /* @translate */
  prevLabel?: string; /* @translate */
  customColor?: string; /* @color */
  onSubmit?: (values: Record<string, any>) => void; /* @type|function|args:values */
  
  /**
   * @class|[
   *   {"key": "Theme", "prefix": "bg", "type": "select", "options": [{"key": "transparent", "label": "Transparent"}, {"key": "white dark:bg-gray-900", "label": "Standard Base"}, {"key": "gray-50 dark:bg-gray-800", "label": "Subtle Base"}]},
   *   {"key": "Shadow", "prefix": "shadow", "type": "select", "options": [{"key": "none", "label": "None"}, {"key": "sm", "label": "Small"}, {"key": "md", "label": "Medium"}]}
   * ]
   */
  className?: string;
}

// --- Inline Textarea to utilize the new context & FieldWrapper ---
const FormTextarea = ({ field }: { field: FormField }) => {
  const context = useRudraForm();
  const isInsideForm = !!context;
  
  const activeValue = isInsideForm ? (context.values[field.id] || '') : '';
  const errorMessage = isInsideForm ? context.errors[field.id] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isInsideForm) {
      context.handleChange(field.id, e.target.value);
    }
  };

  // Uses inherited border and ring colors
  const errorClass = errorMessage 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
    : "border-black/20 dark:border-white/20 focus:ring-black/10 dark:focus:ring-white/10";

  return (
    <FieldWrapper label={field.label} required={field.required} error={errorMessage}>
      <textarea
        name={field.id}
        rows={4}
        placeholder={field.placeholder}
        required={field.required}
        value={activeValue}
        onChange={handleChange}
        // bg-transparent ensures it inherits the form's background color
        className={`w-full outline-none bg-transparent transition-all peer text-sm text-inherit rounded-md px-3 py-2 focus:ring-4 ${errorClass}`}
      />
    </FieldWrapper>
  );
};

export default function JSONForm({
  schema = [],
  submitLabel = 'Submit',
  nextLabel = 'Next',
  prevLabel = 'Previous',
  customColor = '#3b82f6',
  onSubmit,
  // Provide a sensible default theme that the builder can easily override via the @class schema
  className = 'bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 shadow-sm p-6 rounded-xl text-gray-900 dark:text-white',
}: JSONFormProps) { /* @metadata A dynamic, multi-step JSON-driven form builder that inherits themes automatically from the consuming application. */
  
  const [currentStep, setCurrentStep] = useState(0);

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
    <Form 
      onSubmit={onSubmit} 
      className={`w-full max-w-2xl ${className}`}
    >
      {/* Progress Header */}
      {isMultiStep && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {/* Uses text-inherit to match the container's text color automatically */}
            <h3 className="text-lg font-semibold text-inherit">{activeStep.title}</h3>
            {/* Uses opacity instead of a hardcoded gray so it looks good on ANY background */}
            <span className="text-sm opacity-60 text-inherit">Step {currentStep + 1} of {schema.length}</span>
          </div>
          {/* Universal Progress Track: Uses a 5% black overlay in light mode, and 10% white overlay in dark mode */}
          <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / schema.length) * 100}%`, backgroundColor: customColor }}
            />
          </div>
        </div>
      )}

      {/* Dynamic Fields */}
      <div className="flex flex-col gap-1 mb-8">
        {activeStep.fields.map(field => {
          if (field.type === 'textarea') return <FormTextarea key={field.id} field={field} />;
          if (field.type === 'select') return <Select key={field.id} name={field.id} label={field.label} required={field.required} options={field.options} />;
          if (field.type === 'checkbox') return <Checkbox key={field.id} name={field.id} label={field.label} description={field.placeholder} required={field.required} />;

          return (
            <Input
              key={field.id}
              type={field.type}
              name={field.id}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
            />
          );
        })}
      </div>

      {/* Navigation Footer */}
      {/* Divider relies on universal opacity rather than hardcoded zinc borders */}
      <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
        {isMultiStep && currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            // Hover uses universal opacity overlays to look good on any theme
            className="px-4 py-2 text-sm font-medium text-inherit opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-all"
          >
            {prevLabel}
          </button>
        ) : <div />}

        {isMultiStep && currentStep < schema.length - 1 ? (
          <button
            type="button"
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
    </Form>
  );
}