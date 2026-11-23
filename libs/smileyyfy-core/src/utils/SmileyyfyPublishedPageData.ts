interface SmileyyfyPublishedPageData {
  templateId?: string;
  defaultLanguage?: string;
  languages?: { code: string; label: string }[];
  blocks?: {
    id?: string;
    type: string;
    data?: Record<string, string | boolean>;
    translations?: Record<string, Record<string, string>>;
  }[];
}

export type { SmileyyfyPublishedPageData as default };
