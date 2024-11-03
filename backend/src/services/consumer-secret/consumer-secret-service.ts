/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */

import { TConsumerSecretDALFactory } from "@app/services/consumer-secret/consumer-secret-dal";
import {
  decryptConsumerSecretToModelDTO,
  encryptConsumerSecretModelDTO
} from "@app/services/consumer-secret/consumer-secrets-enc-utils";

import { TCreateConsumerSecretDTOInsert } from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  // TODO: add permission service and other services as well
};

// TODO: implement the service that uses the DAL (Data Access Layer) to interact with the database
export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;
export const consumerSecretServiceFactory = ({ consumerSecretDAL }: TConsumerSecretServiceFactoryDep) => {
  /**
   * Creates a consumer secret
   * @param body
   */
  const createSecret = async (body: TCreateConsumerSecretDTOInsert) => {
    const encConsumerSecret = encryptConsumerSecretModelDTO(body);

    const addedSecret = await consumerSecretDAL.create({
      name: body.name,
      type: body.type,
      organizationId: body.organizationId,
      userId: body.userId,

      encryptedValue: encConsumerSecret.secretValue,
      encryptedComment: encConsumerSecret.secretComment
    });

    return addedSecret;
  };

  /**
   * List and decrypt secrets by organizationId
   * @param organizationId
   */
  const listAndDecryptSecretsByOrganizationId = async (organizationId: string) => {
    const secrets = await consumerSecretDAL.listByOrganizationId(organizationId);
    return secrets.map(decryptConsumerSecretToModelDTO);
  };

  const deleteSecretById = async (id: string) => {
    return consumerSecretDAL.deleteByConsumerSecretId(id);
  };

  const getSecretById = async (id: string) => {
    return consumerSecretDAL.getByConsumerSecretId(id);
  };

  return {
    createSecret,
    listAndDecryptSecretsByOrganizationId,
    deleteSecretById,
    getSecretById
  };
};
