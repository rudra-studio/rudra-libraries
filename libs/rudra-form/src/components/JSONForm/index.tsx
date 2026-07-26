import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import Form from '../Form';
import Input from '../Input';
import Select from '../Select';
import Checkbox from '../Checkbox';
import FieldWrapper from '../FieldWrapper';
import { useRudraForm } from '../RudraFormContext';

export type FormField = {
  id: string; 
  type: 'text' | 'email' | 'password' | 'textarea' | 'checkbox' | 'select'; 
  label: string; 
  placeholder?: string; 
  required?: boolean; 
  icon?: string; 
  options?: { label: string; value: string }[]; 
};

export type FormStep = {
  title: string; 
  fields: FormField[]; 
};

export interface JSONFormProps {
  schema?: FormStep[]; 
  submitLabel?: string; 
  nextLabel?: string; 
  prevLabel?: string; 
  customColor?: string; 
  buttonVariant?: 'solid' | 'outline' | 'ghost'; 
  buttonSize?: 'sm' | 'md' | 'lg'; 
  buttonRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'; 
  onSubmit?: (values: Record<string, any>) => void; 
  onChange?: (values: Record<string, any>) => void; 
  // 🚀 FIX 1: Updated signature to expect a global string message or a boolean
  validate?: (values: Record<string, any>) => boolean | string; 
  className?: string;
}

const DynamicIcon = ({ name }: { name?: string }) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as Record<string, any>)[name];
  if (!IconComponent) return null;
  return <IconComponent className="w-4 h-4" />;
};

const FormTextarea = ({ field, errorOverride, onChangeValue }: { field: FormField, errorOverride?: string, onChangeValue: (val: string) => void }) => {
  const context = useRudraForm();
  const isInsideForm = !!context;
  
  const activeValue = isInsideForm ? (context.values[field.id] || '') : '';
  const errorMessage = errorOverride || (isInsideForm ? context.errors[field.id] : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isInsideForm) context.handleChange(field.id, e.target.value);
    onChangeValue(e.target.value);
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
  buttonVariant = 'solid',
  buttonSize = 'md',
  buttonRadius = 'md',
  onSubmit,
  onChange,
  validate,
  className = 'bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 p-6 shadow-sm rounded-xl text-gray-900 dark:text-white',
}: JSONFormProps) { 
  
  const [currentStep, setCurrentStep] = useState(0);
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  const activeStep = schema[currentStep];
  const isMultiStep = schema.length > 1;
  const isSinglePage = schema.length === 1;

  if (!activeStep || schema.length === 0) return null;

  // 🚀 FIX 2: Evaluate validation dynamically on every render
  let globalError: string | null = null;
  let isValid = true;

  if (validate) {
    const valResult = validate(localValues);
    if (typeof valResult === 'string') {
      globalError = valResult;
      isValid = false;
    } else if (valResult === false) {
      isValid = false;
    }
  }

  const handleFieldChange = (id: string, val: any) => {
    const updatedValues = { ...localValues, [id]: val };
    setLocalValues(updatedValues);
    if (onChange) onChange(updatedValues);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isValid && currentStep < schema.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleManualSubmit = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); 
    if (isValid && onSubmit) {
      onSubmit(localValues); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      if (!isValid) return; // Prevent enter key submission if validation fails
      
      if (isSinglePage || currentStep === schema.length - 1) {
        handleManualSubmit();
      } else {
        handleNext();
      }
    }
  };

  const sizeMap = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const radiusMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };

  const isDefaultColor = customColor === '#3b82f6';
  let primaryBtnClass = `font-medium transition-all shadow-sm ${sizeMap[buttonSize]} ${radiusMap[buttonRadius]} `;
  
  if (buttonVariant === 'solid') {
    if (isDefaultColor) {
      primaryBtnClass += "bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100";
    } else {
      primaryBtnClass += "text-white hover:opacity-90";
    }
  } else if (buttonVariant === 'outline') {
    primaryBtnClass += "border-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10";
  } else if (buttonVariant === 'ghost') {
    primaryBtnClass += "bg-opacity-10 hover:bg-opacity-20";
  }

  const primaryBtnStyle = buttonVariant === 'solid' 
    ? (isDefaultColor ? {} : { backgroundColor: customColor })
    : buttonVariant === 'outline' 
    ? { borderColor: customColor, color: customColor } 
    : { backgroundColor: `${customColor}20`, color: customColor };

  return (
    <div onKeyDown={handleKeyDown}>
      <Form className={`w-full max-w-2xl border transition-all duration-300 ${className}`}>
        
        {isMultiStep && (
          <div className="mb-6">
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

        {/* 🚀 FIX 3: Global Error Message Banner */}
        {globalError && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-md flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <LucideIcons.AlertCircle className="w-5 h-5 shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        <div className="flex flex-col gap-1 mb-8">
          {activeStep.fields.map(field => {
            if (field.type === 'textarea') return <FormTextarea key={field.id} field={field} errorOverride={undefined} onChangeValue={(val) => handleFieldChange(field.id, val)} />;
            if (field.type === 'select') return <Select key={field.id} name={field.id} label={field.label} required={field.required} options={field.options} onChangeValue={(val) => handleFieldChange(field.id, val)} />;
            if (field.type === 'checkbox') return <Checkbox key={field.id} name={field.id} label={field.label} description={field.placeholder} required={field.required} onChangeValue={(val) => handleFieldChange(field.id, val)} />;

            return (
              <Input
                key={field.id}
                type={field.type}
                name={field.id}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                icon={field.icon ? <DynamicIcon name={field.icon} /> : undefined}
                error={undefined}
                onChangeValue={(val) => handleFieldChange(field.id, val)}
              />
            );
          })}
        </div>

        <div className={`flex items-center pt-4 border-t border-black/10 dark:border-white/10 ${isSinglePage ? 'justify-center' : 'justify-between'}`}>
          {isMultiStep && currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className={`font-medium text-inherit opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all ${sizeMap[buttonSize]} ${radiusMap[buttonRadius]}`}
            >
              {prevLabel}
            </button>
          ) : !isSinglePage ? <div /> : null}

          {isMultiStep && currentStep < schema.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isValid}
              // 🚀 FIX 4: Disable Next Button styling if invalid
              className={`${primaryBtnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={primaryBtnStyle}
            >
              {nextLabel}
            </button>
          ) : (
            <button
              type="button" 
              onClick={handleManualSubmit}
              disabled={!isValid}
              // 🚀 FIX 4: Disable Submit Button styling if invalid
              className={`${primaryBtnClass} ${isSinglePage ? 'w-full' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={primaryBtnStyle}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}