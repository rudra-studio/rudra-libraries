export type ConditionOperator = 
  | '==' 
  | '===' 
  | '!=' 
  | '!==' 
  | '>' 
  | '<' 
  | '>=' 
  | '<=' 
  | 'contains' 
  | 'not_contains' 
  | 'is_empty' 
  | 'is_not_empty';

export interface IfElseProps {
  /** The primary value being evaluated */
  source: any;
  /** The logical operator to apply */
  condition: ConditionOperator;
  /** The secondary value to compare against (Optional for 'is_empty' checks) */
  target?: any;
  /** The value to return if the condition evaluates to true */
  trueValue: any;
  /** The value to return if the condition evaluates to false */
  falseValue: any;
}

export default function IfElse({ 
  source, 
  condition, 
  target, 
  trueValue, 
  falseValue 
}: IfElseProps): any {
  
  let isTruthy = false;

  switch (condition) {
    case '===':
      isTruthy = source === target;
      break;
    case '==':
      // eslint-disable-next-line eqeqeq
      isTruthy = source == target;
      break;
    case '!==':
      isTruthy = source !== target;
      break;
    case '!=':
      // eslint-disable-next-line eqeqeq
      isTruthy = source != target;
      break;
    case '>':
      isTruthy = source > target;
      break;
    case '<':
      isTruthy = source < target;
      break;
    case '>=':
      isTruthy = source >= target;
      break;
    case '<=':
      isTruthy = source <= target;
      break;
    case 'contains':
      // Safely check if arrays or strings contain the target
      isTruthy = (Array.isArray(source) || typeof source === 'string') 
        ? source.includes(target) 
        : false;
      break;
    case 'not_contains':
      isTruthy = (Array.isArray(source) || typeof source === 'string') 
        ? !source.includes(target) 
        : true;
      break;
    case 'is_empty':
      isTruthy = 
        source === null || 
        source === undefined || 
        source === '' || 
        (Array.isArray(source) && source.length === 0) || 
        (typeof source === 'object' && Object.keys(source).length === 0);
      break;
    case 'is_not_empty':
      isTruthy = !(
        source === null || 
        source === undefined || 
        source === '' || 
        (Array.isArray(source) && source.length === 0) || 
        (typeof source === 'object' && Object.keys(source).length === 0)
      );
      break;
    default:
      // Fallback in case a bad operator is passed
      isTruthy = !!source; 
  }

  return isTruthy ? trueValue : falseValue;
}