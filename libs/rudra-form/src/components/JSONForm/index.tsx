import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import Form from '../Form';
import Input from '../Input';
import Select from '../Select';
import Checkbox from '../Checkbox';
import FieldWrapper from '../FieldWrapper';
import { useRudraForm } from '../RudraFormContext';

export type FormField = {
  id: string; /* @type|string */
  type: 'text' | 'email' | 'password' | 'textarea' | 'checkbox' | 'select'; /* @select|text|email|password|textarea|checkbox|select */
  label: string; /* @type|string */
  placeholder?: string; /* @type|string */
  required?: boolean; /* @type|boolean */
  icon?: string; /* @type|string */
  options?: { label: string; value: string }[]; /* @type|json */
};

export type FormStep = {
  title: string; /* @type|string */
  fields: FormField[]; /* @type|json */
};

export interface JSONFormProps {
  schema?: FormStep[]; /* @widget|generic-array-builder */
  submitLabel?: string; /* @translate */
  nextLabel?: string; /* @translate */
  prevLabel?: string; /* @translate */
  customColor?: string; /* @color */
  onSubmit?: (values: Record<string, any>) => void; /* @type|function|args:values */
  
  /** * @type|class
   * @schema [{
   * "key": "Theme",
   * "prefix": "",
   * "type": "select",
   * "options": [
   * {"key": "bg-white dark:bg-gray-900 border-black/10 dark:border-white/10", "label": "Solid (Default)"},
   * {"key": "bg-transparent border-transparent", "label": "Transparent"},
   * {"key": "bg-white/40 dark:bg-black/40 backdrop-blur-xl border-white/50 dark:border-white/10", "label": "Glassmorphism"}
   * ]
   * },{
   * "key": "Padding",
   * "prefix": "p",
   * "type": "select",
   * "options": [
   * {"key": "4", "label": "Small"},
   * {"key": "6", "label": "Medium"},
   * {"key": "8", "label": "Large"}
   * ]
   * },{
   * "key": "Shadow",
   * "prefix": "shadow",
   * "type": "select",
   * "options": [
   * {"key": "none", "label": "None"},
   * {"key": "sm", "label": "Small"},
   * {"key": "md", "label": "Medium"},
   * {"key": "xl", "label": "Large"}
   * ]
   * }]
   */
  className?: string;
}

const DynamicIcon = ({ name }: { name?: string }) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as Record<string, any>)[name];
  if (!IconComponent) return null;
  return <IconComponent className="w-4 h-4" />;
};

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
    ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" 
    : "border-black/20 dark:border-white/20 focus:ring-black/10 dark:focus:ring-white/10";

  return (
    <FieldWrapper label={field.label} required={field.required} error={errorMessage}>
      <div className="relative w-full flex items-center">
        <textarea
          name={field.id}
          rows={4}
          placeholder={field.placeholder}
          required={field.required}
          value={activeValue}
          onChange={handleChange}
          className={`w-full outline-none bg-transparent transition-all peer text-sm text-inherit rounded-md px-3 py-2 border focus:ring-4 ${field.icon ? 'pl-9' : ''} ${errorClass}`}
        />
        {field.icon && (
          <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center justify-center">
            <DynamicIcon name={field.icon} />
          </div>
        )}
      </div>
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
  className = 'bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-6 shadow-sm rounded-xl text-gray-900 dark:text-white',
}: JSONFormProps) { /* @metadata A dynamic, multi-step JSON-driven form builder featuring string-to-icon resolution via Lucide React. */
  
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
      className={`w-full max-w-2xl border transition-all duration-300 ${className}`}
    >
      {isMultiStep && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-inherit">{activeStep.title}</h3>
            <span className="text-sm opacity-60 text-inherit">Step {currentStep + 1} of {schema.length}</span>
          </div>
          <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / schema.length) * 100}%`, backgroundColor: customColor }}
            />
          </div>
        </div>
      )}

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
              icon={field.icon ? <DynamicIcon name={field.icon} /> : undefined}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
        {isMultiStep && currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
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