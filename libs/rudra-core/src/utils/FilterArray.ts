export interface FilterArrayProps {
  /** The array of objects to filter */
  array: any;
  /** The key in the object to check (e.g., 'status' or 'category') */
  filterKey: string;
  /** The operator to use */
  operator?: '==' | '!=' | 'contains' | '>', 
  /** The value to compare against */
  value: any;
  /** Fallback if it fails */
  fallback?: any[];
}

export default function FilterArray({
  array,
  filterKey,
  operator = '==',
  value,
  fallback = []
}: FilterArrayProps): any[] {
  if (!Array.isArray(array)) return fallback;

  try {
    return array.filter((item) => {
      // If the item isn't an object or doesn't have the key, exclude it
      if (!item || typeof item !== 'object') return false;
      
      const itemValue = item[filterKey];

      switch (operator) {
        case '==':
          // eslint-disable-next-line eqeqeq
          return itemValue == value;
        case '!=':
          // eslint-disable-next-line eqeqeq
          return itemValue != value;
        case '>':
          return itemValue > value;
        case 'contains':
          return (typeof itemValue === 'string' || Array.isArray(itemValue)) 
            ? itemValue.includes(value) 
            : false;
        default:
          return false;
      }
    });
  } catch (error) {
    console.error('Failed to filter array:', error);
    return fallback;
  }
}