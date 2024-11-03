/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */

import { encryptSymmetric128BitHexKeyUTF8 } from "@app/lib/crypto";
import { TConsumerSecretDALFactory } from "@app/services/consumer-secret/consumer-secret-dal";
import { combineFields } from "@app/services/consumer-secret/consumer-secrets-enc-utils";

import { TCreateConsumerSecretDTO } from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  // TODO: add permission service and other services as well
};

// TODO: implement the service that uses the DAL (Data Access Layer) to interact with the database
export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;
export const consumerSecretServiceFactory = ({ consumerSecretDAL }: TConsumerSecretServiceFactoryDep) => {
  const createSecret = async (body: TCreateConsumerSecretDTO) => {
    // const { permission } = await permissionService.getProjectPermission(
    //   actor,
    //   actorId,
    //   projectId,
    //   actorAuthMethod,
    //   actorOrgId
    // );
    // ForbiddenError.from(permission).throwUnlessCan(
    //   ProjectPermissionActions.Create,
    //   subject(ProjectPermissionSub.Secrets, { environment, secretPath: path })
    // );

    // await projectDAL.checkProjectUpgradeStatus(projectId);

    // if user creating personal check its shared also exist

    // const _ = await consumerSecretDAL.create(inputSecret);

    // Is there a better way to do this?
    const stringifiedSecretValue = JSON.stringify(body.secretValue);

    // FIXME: What enc key can we use? Maybe something related and unique to the Org, but hidden from the outside world mmmm
    // Could I use infisicalSymmetricEncypt and use the ROOT key? Maybe not? mmmmmmmmm
    const tempKey = "01234567890123456789012345678901";

    const secretValueEncrypted = encryptSymmetric128BitHexKeyUTF8(stringifiedSecretValue, tempKey);
    const secretCommentEncrypted = encryptSymmetric128BitHexKeyUTF8(body.secretComment, tempKey);
    // Should I merge chiperText, iv, tag, keyEncoding, algorithm, etc. into a single stringEncryptedValue and store it in the DB as a single column?
    // I noticed that there's a service called kmsServiceFactory that has a encryptor and decryptor that merges those 3 fields into a signle blob buffer and saves it in the db as a blob column not 3 strings
    // For this MVP I'll do code duplication:

    // concat the buffers in an order that can be split later
    // I'm going to save those fields in the DB as "encryptedValue" and "encryptedComment" as a single column
    const encryptedValueBuffer = combineFields(secretValueEncrypted);
    const encryptedCommentBuffer = combineFields(secretCommentEncrypted);

    const addedSecret = await consumerSecretDAL.create({
      name: body.name,
      type: body.type,
      organizationId: body.organizationId,
      userId: "6e74f399-b138-4f4e-94ab-bd0827b1e4fe", // just inserting to me kekekeke

      encryptedValue: encryptedValueBuffer,
      encryptedComment: encryptedCommentBuffer
    });

    /*

        how to decrypt the fields:

        const secretValueDecrypted = decryptSymmetric128BitHexKeyUTF8(
            {
                ...splitFields(encryptedValueBuffer),
                key: tempKey
            }
        );

        const secretCommentDecrypted = decryptSymmetric128BitHexKeyUTF8(
            {
                ...splitFields(encryptedCommentBuffer),
                key: tempKey
            }
        );
         */

    // fixme
    return {
      secret: addedSecret
    };
  };

  return {
    createSecret
  };
};
