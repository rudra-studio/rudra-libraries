import React, { useState, useCallback, FormEvent } from 'react';
import RudraFormContext from '../RudraFormContext';

// --- Component Props ---
export interface FormProps {
  initialValues?: Record<string, any>; /* @type|json */
  onSubmit?: (values: Record<string, any>) => void; /* @type|function|args:values */
  children?: React.ReactNode; /* @type|node */
  className?: string;
  style?: React.CSSProperties;
}

const Form = ({ 
  initialValues = {}, 
  onSubmit, 
  children, 
  className = '',
  style = {}
}: FormProps) => { 
  
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); 
    if (onSubmit) {
      onSubmit(values); 
    }
  };

  return (
    <RudraFormContext.Provider value={{ values, errors, handleChange, setFieldError }}>
      <form onSubmit={handleSubmit} className={`w-full ${className}`} style={style}>
        {children}
      </form>
    </RudraFormContext.Provider>
  );
};

export default Form;