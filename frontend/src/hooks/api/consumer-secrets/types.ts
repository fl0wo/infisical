// TODO: rectify/standardize types

export type TCreateConsumerSecretRequest = {
    id: string,
    organizationId: string,
    name: string,
    note?: string,
    content: TConsumerSecret
}

export type TConsumerSecret = {
  type: "website_login" | "credit_card" | "secure_note",
  name: string,
  note?: string,

  secret: WebsiteLoginContent | CreditCardContent | SecureNoteContent
}

export type WebsiteLoginContent = {
  username: string,
  password: string,
  url: string
}

export type CreditCardContent = {
  cardNumber: string,
  expirationDate: string,
  cvv: string
}

export type SecureNoteContent = {
  note: string
}