import { ConsumerSecretType } from "@app/db/schemas";

export type TCreateConsumerSecretDTO = {
  organizationId: string;
  name: string;
  secretComment: string;
  type: ConsumerSecretType;

  secretValue:
    | {
        type: ConsumerSecretType.WebsiteLogin;
        url?: string | undefined;
        username: string;
        password: string;
      }
    | {
        type: ConsumerSecretType.CreditCard;
        cardNumber: string;
        cardHolderName: string;
        expirationDate: string;
        cvv: string;
      }
    | {
        type: ConsumerSecretType.SecureNote;
        note: string;
      };
};
