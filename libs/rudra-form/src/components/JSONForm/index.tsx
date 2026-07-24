import React, { useState } from 'react';
import  Form  from '../Form';
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

  const errorClass = errorMessage 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500";

  return (
    <FieldWrapper label={field.label} required={field.required} error={errorMessage}>
      <textarea
        name={field.id}
        rows={4}
        placeholder={field.placeholder}
        required={field.required}
        value={activeValue}
        onChange={handleChange}
        className={`w-full outline-none bg-white dark:bg-gray-900 transition-all peer text-sm text-gray-900 dark:text-white rounded-md px-3 py-2 focus:ring-4 ${errorClass}`}
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
  className = '',
}: JSONFormProps) { /* @metadata A dynamic, multi-step JSON-driven form builder that automatically integrates with the unified form context. */
  
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
      className={`w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 ${className}`}
    >
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

      {/* Dynamic Fields injected using our universal form components */}
      <div className="flex flex-col gap-1 mb-8">
        {activeStep.fields.map(field => {
          
          if (field.type === 'textarea') {
            return <FormTextarea key={field.id} field={field} />;
          } 
          
          if (field.type === 'select') {
            return (
              <Select
                key={field.id}
                name={field.id}
                label={field.label}
                required={field.required}
                options={field.options}
              />
            );
          }
          
          if (field.type === 'checkbox') {
            return (
              <Checkbox
                key={field.id}
                name={field.id}
                label={field.label}
                description={field.placeholder} // Repurposing placeholder as sub-text
                required={field.required}
              />
            );
          }

          // Default text / email fallback
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
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        {isMultiStep && currentStep > 0 ? (
          <button
            type="button" // 🚨 Crucial: Prevents premature form submission
            onClick={handlePrev}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            {prevLabel}
          </button>
        ) : <div />}

        {isMultiStep && currentStep < schema.length - 1 ? (
          <button
            type="button" // 🚨 Crucial: Prevents premature form submission
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-opacity hover:opacity-90 shadow-sm"
            style={{ backgroundColor: customColor }}
          >
            {nextLabel}
          </button>
        ) : (
          <button
            type="submit" // 🚀 Automatically triggers the <Form> Context's onSubmit
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