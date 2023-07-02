export type User = {
  uid: string | null,
  email: string | null,
  access?: string,
  providerData?: unknown
}

export type ErrorResponse = {
  error: {
    message: string
  }
}

//  TODO Introduce base activity
export type WordActivity = {
  type: 'word';
  word: string;
  translation: string;
}

export type PhraseActivity = {
  type: 'phrase';
  phrase: string; 
  translation: string;
}

export type SlideActivity = {
  type: 'slide';
  header: string; 
  slide: string;
}

export type Activity = WordActivity | PhraseActivity | SlideActivity
export type ModuleType = 'course' | 'lesson' | 'activity'
export type Module = {
  id?: string;
  parent: string;
  name: string;
  type: ModuleType;
  position?: number;
  activity? : Activity;
}
