import { ConsumerSecretType } from "@app/db/schemas";

export type TCreateConsumerSecretDTO = {
  id?: string | null | undefined;
  organizationId?: string | null | undefined;
  name: string;
  secretComment: string;
  type: ConsumerSecretType;
  userId?: string | null | undefined;

  createdAt?: Date;
  updatedAt?: Date;

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
