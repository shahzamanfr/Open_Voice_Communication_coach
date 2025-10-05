export enum CoachMode {
  Teacher = 'Teacher',
  Debater = 'Debater',
  Storyteller = 'Storyteller',
}

export interface CommunicationBehavior {
  profile: string;
  strength: string;
  growthArea: string;
}

export interface ExampleRewrite {
  original: string;
  improved: string;
  reasoning: string;
}

export interface Feedback {
  score: number;
  whatYouDidWell: string;
  areasForImprovement: string;
  personalizedTip: string;
  spokenResponse: string;
  communicationBehavior: CommunicationBehavior;
  exampleRewrite: ExampleRewrite;
}

export interface ScoreHistory {
  date: string;
  score: number;
  mode: CoachMode;
}

export interface DomainImage {
  id: string;
  src: string;
  alt: string;
}

export interface ImageDomain {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  accentClass: string;
  imageAccentClass: string;
  images: DomainImage[];
}

export enum LoadingState {
  Idle = 'idle',
  GeneratingCaption = 'generating_caption',
  GeneratingFeedback = 'generating_feedback',
  Done = 'done',
  Error = 'error',
}
