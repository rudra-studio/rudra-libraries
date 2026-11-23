interface SmileyyfyCanvasBlock {
  id: string;
  type: string;
  data: Record<string, string | boolean>;
  translations?: Record<string, Record<string, string>>;
}

export type { SmileyyfyCanvasBlock as default };
