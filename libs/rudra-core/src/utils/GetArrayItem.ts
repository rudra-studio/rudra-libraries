export interface GetArrayItemProps {
  /** The array to extract from */
  array: any;
  /** Which item to get */
  index: number | 'first' | 'last' | 'random';
  /** What to return if the item doesn't exist */
  fallback?: any;
}

export default function GetArrayItem({
  array,
  index,
  fallback = null
}: GetArrayItemProps): any {
  if (!Array.isArray(array) || array.length === 0) return fallback;

  try {
    if (index === 'first') return array[0];
    if (index === 'last') return array[array.length - 1];
    if (index === 'random') return array[Math.floor(Math.random() * array.length)];

    // Numeric index
    if (typeof index === 'number') {
      // Support negative indexing (e.g., -1 gets the last item)
      const parsedIndex = index < 0 ? array.length + index : index;
      return array[parsedIndex] !== undefined ? array[parsedIndex] : fallback;
    }

    return fallback;
  } catch (error) {
    console.error('Failed to get array item:', error);
    return fallback;
  }
}