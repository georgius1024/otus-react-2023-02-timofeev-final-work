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

export type WordActivity = {
  word: string;
  translation: string;
}

export type PhraseActivity = {
  phrase: string;
  translation: string;
}

export type Activity = WordActivity | PhraseActivity


export type Module = {
  id?: string;
  parent: string;
  name: string;
  type: string;
  position?: number;
  activity? : Activity;
}
