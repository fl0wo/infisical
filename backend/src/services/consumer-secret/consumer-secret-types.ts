import { ConsumerSecretType } from "@app/db/schemas";

export type TCreateConsumerSecretDTO = {
  id: string;
  organizationId: string;
  userId: string;

  name: string;
  secretComment: string;
  type: ConsumerSecretType;

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

export type TCreateConsumerSecretDTOInsert = Omit<TCreateConsumerSecretDTO, "id" | "createdAt" | "updatedAt">;
