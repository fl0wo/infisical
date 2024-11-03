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
    cvv: string,
    cardHolderName: string
}

export type SecureNoteContent = {
    note: string
}


export type TConsumerSecretFetched = {

    id: string,

    type: "website_login" | "credit_card" | "secure_note",
    name: string,

    userId?: string,
    organizationId?: string,

    createdAt?: string,
    updatedAt?: string,

    secretComment: string,
    secretValue: WebsiteLoginContent | CreditCardContent | SecureNoteContent,
}

export type TConsumerSecretFetchedResponse = {
    consumerSecrets: TConsumerSecretFetched[]
}