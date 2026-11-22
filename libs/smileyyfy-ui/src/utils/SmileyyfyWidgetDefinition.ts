import type SmileyyfyWidgetCategory from './SmileyyfyWidgetCategory';
import type SmileyyfyWidgetField from './SmileyyfyWidgetField';

export interface SmileyyfyWidgetDefinition {
  type: string;
  category: SmileyyfyWidgetCategory;
  name: string;
  icon: string;
  summary: string;
  defaultData: Record<string, string | boolean>;
  defaultTranslations?: Record<string, Record<string, string>>;
  fields: SmileyyfyWidgetField[];
}
