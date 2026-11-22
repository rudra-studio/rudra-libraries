import type SmileyyfyLanguageOption from './SmileyyfyLanguageOption';
import type SmileyyfyCanvasBlock from './SmileyyfyCanvasBlock';

export interface SmileyyfyPageSnapshot {
  templateId: string;
  defaultLanguage: string;
  languages: SmileyyfyLanguageOption[];
  blocks: SmileyyfyCanvasBlock[];
}
