export type ExplanationMode = 'plain' | 'professional';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  hasScreenContext?: boolean;
  mode?: ExplanationMode;
}

export interface ScreenContextData {
  title: string;
  source: string;
  text: string;
  timestamp: string;
  previewSnippet: string;
  captureType?: 'full' | 'area';
  areaDimensions?: { width: number; height: number };
}

export interface FinancialBulletin {
  id: string;
  time: string;
  type: string;
  title: string;
  summary: string;
  source: string;
  isObjective: boolean;
  typeEn?: string;
  titleEn?: string;
  summaryEn?: string;
  sourceEn?: string;
}

export interface DictionaryItem {
  term: string;
  termEn?: string;
  category: string;
  categoryEn?: string;
  definition: string;
  definitionEn?: string;
  formula?: string;
}

export interface TranslationResult {
  term: string;
  plainText: string;
  formalDefinition: string;
  formula?: string;
  safetyBoundary?: string;
  category?: 'kline' | 'fund' | 'financial_planning' | 'report' | 'insurance';
  isComplianceBlocked?: boolean;
  blockedReason?: string;
}

export interface DemoArticle {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  highlightedTerms: string[];
}

export interface ExtensionFileSnippet {
  name: string;
  language: string;
  description: string;
  code: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  labelEn?: string;
  desc: string;
  descEn?: string;
  mathFormula?: string;
  plainMeaning?: string;
  plainMeaningEn?: string;
  type?: 'source' | 'process' | 'metric' | 'destination' | 'risk';
  tag?: string;
  tagEn?: string;
}

export interface DiagramFlow {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: 'fund' | 'loan' | 'kline' | 'analysis' | 'statements' | 'system';
  categoryLabel: string;
  categoryLabelEn: string;
  nodes: DiagramNode[];
  connections: { from: string; to: string; label?: string; labelEn?: string }[];
  summaryPlain: string;
  summaryPlainEn: string;
  summaryPro: string;
  summaryProEn: string;
}
