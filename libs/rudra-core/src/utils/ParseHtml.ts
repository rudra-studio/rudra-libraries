import parserModule from 'html-react-parser';
import type { ReactNode } from 'react';

// 🚀 THE AGGRESSIVE RESOLVER
// It checks every possible place the bundler might have hidden the function.
const getParseFunction = () => {
  // 1. Standard ESM shape
  if (typeof parserModule === 'function') return parserModule;
  
  // 2. CommonJS transpiled shape
  if (parserModule && typeof (parserModule as any).default === 'function') {
    return (parserModule as any).default;
  }
  
  // 3. Double-nested default (happens in some Next.js/Turbopack setups)
  if (parserModule && typeof (parserModule as any).default?.default === 'function') {
    return (parserModule as any).default.default;
  }

  return null;
};

export interface ParseHtmlProps {
  htmlString: string;
  fallback?: ReactNode;
}

export default function ParseHtml({ 
  htmlString = "Test<br/>TT", 
  fallback = null 
}: ParseHtmlProps): ReactNode | ReactNode[] | string {
  
  if (typeof htmlString !== 'string' || !htmlString.trim()) {
    return fallback;
  }

  const parse = getParseFunction();

  if (!parse) {
    console.error('CRITICAL: html-react-parser function could not be resolved by the bundler.');
    return fallback !== null ? fallback : htmlString;
  }

  try {
    return parse(htmlString);
  } catch (error) {
    console.error('Failed to parse HTML string:', error);
    return fallback !== null ? fallback : htmlString; 
  }
}