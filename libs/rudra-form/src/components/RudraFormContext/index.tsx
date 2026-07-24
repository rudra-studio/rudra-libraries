import { createContext, useContext } from 'react';

// --- Types ---
export interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
}

// --- Context ---
const RudraFormContext = createContext<FormContextType | undefined>(undefined);

// --- Custom Hook ---
// This safely grabs the context and makes it easier to use in input components
export const useRudraForm = () => {
  return useContext(RudraFormContext);
};

export default RudraFormContext;