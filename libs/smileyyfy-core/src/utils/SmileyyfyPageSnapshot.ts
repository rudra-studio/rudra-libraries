import type SmileyyfyLanguageOption from './SmileyyfyLanguageOption';
import type SmileyyfyCanvasBlock from './SmileyyfyCanvasBlock';

interface SmileyyfyPageSnapshot {
  templateId: string;
  defaultLanguage: string;
  languages: SmileyyfyLanguageOption[];
  blocks: SmileyyfyCanvasBlock[];
}

export type { SmileyyfyPageSnapshot as default };
