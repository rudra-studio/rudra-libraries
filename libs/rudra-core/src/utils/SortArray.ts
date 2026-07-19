export interface SortArrayProps {
  /** The array to sort */
  array: any;
  /** Sort order */
  order?: 'asc' | 'desc';
  /** If sorting an array of objects, the property key to sort by (e.g., 'price' or 'date') */
  sortKey?: string;
  /** What to return if it fails */
  fallback?: any[];
}

export default function SortArray({
  array,
  order = 'asc',
  sortKey,
  fallback = []
}: SortArrayProps): any[] {
  if (!Array.isArray(array)) return fallback;

  try {
    // Create a shallow copy to prevent mutating React state directly
    const sorted = [...array];

    sorted.sort((a, b) => {
      let valA = sortKey && a && typeof a === 'object' ? a[sortKey] : a;
      let valB = sortKey && b && typeof b === 'object' ? b[sortKey] : b;

      // Handle missing values gracefully
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  } catch (error) {
    console.error('Failed to sort array:', error);
    return fallback;
  }
}