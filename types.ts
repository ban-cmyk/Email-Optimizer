
export type FunnelStage = 'TOFU' | 'MOFU' | 'BOFU';
export type Industry = 'SaaS' | 'Ecommerce' | 'Finance' | 'Automotive' | 'Telecom' | 'Other';
export type FlowGoal = 'educational' | 'trial' | 'demo' | 'other';
export type Language = 'EN' | 'PT-BR';

export interface EmailInput {
  id: string;
  content: string;
}

export interface EmailFlowContext {
  industry: Industry;
  personas: string[];
  goal: FlowGoal;
  language: Language;
  emails: EmailInput[];
}

export interface OptimizationResult {
  dashboard: {
    verdict: string;
    winsRisks: { type: 'win' | 'risk', text: string }[];
    score: number;
    fixFirst: string;
  };
  flowHealth: {
    logicalStructure: 'Yes' | 'Partially' | 'No';
    momentumCheck: string;
    ctaProgression: string;
    articleMix: string;
    improvements: string[];
  };
  emailReviews: {
    name: string;
    role: string;
    positioning: 'Correct' | 'Move earlier' | 'Move later';
    whatWorks: string[];
    toImprove: string[];
    ctaStrength: { assessment: 'Strong' | 'Needs improvement', reasoning: string };
    articleReview: { status: 'Keep' | 'Replace' | 'Optional', reasoning: string };
  }[];
  rewrite: {
    name: string;
    subjects: string[];
    preheader: string;
    strategicPurpose: string;
    copy: string;
    suggestedArticles: string[];
  }[];
  hubspotLayout: {
    emailName: string;
    blocks: { label: string, content: string }[];
  }[];
}
