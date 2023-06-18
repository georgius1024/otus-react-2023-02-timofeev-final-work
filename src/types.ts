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
