import * as yup from "yup";

export const consumerSecretTypes = [
    {
        name: "Website Login",
        type: "website_login"
    },
    {
        name: "Credit Card",
        type: "credit_card"
    },
    {
        name: "Secure Note",
        type: "secure_note"
    }
];

// WebsiteLogin
export const consumerSecretWebsiteLogin = yup.object({
    type: yup
        .string()
        .default("website_login"),

    // SMELL: those are shared with the other consumer secret types as well (credit card, secure note)
    name: yup
        .string()
        .required()
        .max(64, "Too long, maximum length is 64 characters"),

    notes: yup
        .string()
        .max(256, "Too long, maximum length is 256 characters"),

    // website login related fields only
    url: yup.string().url().required("URL is required for website login"),
    username: yup.string().required("Username is required for website login"),
    password: yup.string().required("Password is required for website login")
});

export type TCreateConsumerSecretWebsiteLoginFormData = yup.InferType<typeof consumerSecretWebsiteLogin>;


export const creditCardSchema = yup.object({
    type: yup
        .string()
        .default("credit_card"),

    // SMELL: those are shared with the other consumer secret types as well (website login, secure note)
    name: yup
        .string()
        .required()
        .max(64, "Too long, maximum length is 64 characters"),

    notes: yup
        .string()
        .max(256, "Too long, maximum length is 256 characters"),

    // credit card related fields only
    cardNumber: yup.string().required("Card number is required"),
    expirationDate: yup.string().required("Expiration date is required"),
    cvv: yup.string().required("CVV is required"),
    cardHolderName: yup.string().required("Card holder name is required")
});

export type TCreateConsumerSecretCreditCardFormData = yup.InferType<typeof creditCardSchema>;


const secureNoteSchema = yup.object({
    type: yup
        .string()
        .default("secure_note"),

    // SMELL: those are shared with the other consumer secret types as well (website login, credit card)
    name: yup
        .string()
        .required()
        .max(64, "Too long, maximum length is 64 characters"),

    notes: yup
        .string()
        .max(256, "Too long, maximum length is 256 characters"),

    // secure note related fields only
    content: yup.string().required("Content is required for secure note")
});

export type TCreateConsumerSecretSecureNoteFormData = yup.InferType<typeof secureNoteSchema>;

// dynamically adapts to the type of consumer secret being created
export const consumerSecretFormSchema = yup.object({
    type: yup
        .string()
        .oneOf(
            consumerSecretTypes
                .map((consumerSecretType) =>
                    consumerSecretType.type
                )
        )
        .required()
        .label("Consumer Secret Type")
}).shape({
    data: yup.lazy((value) => {
        switch (value.type) {
            case "website_login":
                return consumerSecretWebsiteLogin;
            case "credit_card":
                return creditCardSchema;
            case "secure_note":
                return secureNoteSchema;
            default:
                return yup.mixed().notRequired();
        }
    })
});

export type TCreateConsumerSecretFormData = yup.InferType<typeof consumerSecretFormSchema>;
