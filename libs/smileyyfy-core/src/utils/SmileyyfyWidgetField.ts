interface SmileyyfyWidgetField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select' | 'boolean';
  placeholder?: string;
  translatable?: boolean;
  options?: { value: string; label: string }[];
}

export type { SmileyyfyWidgetField as default };
