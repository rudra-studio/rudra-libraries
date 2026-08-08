import { useContext } from 'react';
import ScrollStoryContext, {ScrollStoryContextValue} from '../components/ScrollStoryContext';

export default function useScrollStory(): ScrollStoryContextValue {
  const context = useContext(ScrollStoryContext);

  if (!context) {
    throw new Error(
      "Scroll components must be rendered inside ScrollStory.",
    );
  }

  return context;
}