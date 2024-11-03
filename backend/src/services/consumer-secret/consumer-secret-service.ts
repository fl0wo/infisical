/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */

import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { TConsumerSecretDALFactory } from "@app/services/consumer-secret/consumer-secret-dal";
import {
  decryptConsumerSecretToModelDTO,
  encryptConsumerSecretModelDTO
} from "@app/services/consumer-secret/consumer-secrets-enc-utils";

import { TCreateConsumerSecretDTOInsert, TCreateConsumerSecretDTOUpdate } from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  permissionService: TPermissionServiceFactory;
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
    return consumerSecretDAL.create({
      name: body.name,
      type: body.type,
      organizationId: body.organizationId,
      userId: body.userId,

      encryptedValue: encConsumerSecret.secretValue,
      encryptedComment: encConsumerSecret.secretComment
    });
  };

  const updateSecret = async (id: string, body: TCreateConsumerSecretDTOUpdate) => {
    const encConsumerSecret = encryptConsumerSecretModelDTO(body);
    return consumerSecretDAL.updateById(id, {
      name: body.name,
      encryptedValue: encConsumerSecret.secretValue,
      encryptedComment: encConsumerSecret.secretComment
    });
  };

  /**
   * List and decrypt secrets by organizationId
   * @param organizationId
   */
  const listAndDecryptSecretsByOrganizationId = async (organizationId: string) => {
    const secrets = await consumerSecretDAL.listByOrganizationId(organizationId);
    return secrets.map(decryptConsumerSecretToModelDTO);
  };

  const getAndDecryptSecretById = async (id: string) => {
    const secret = await consumerSecretDAL.getByConsumerSecretId(id);
    return decryptConsumerSecretToModelDTO(secret);
  };

  const deleteSecretById = async (id: string) => {
    return consumerSecretDAL.deleteByConsumerSecretId(id);
  };

  const getSecretById = async (id: string) => {
    return consumerSecretDAL.getByConsumerSecretId(id);
  };

  return {
    createSecret,
    updateSecret,
    listAndDecryptSecretsByOrganizationId,
    getAndDecryptSecretById,
    deleteSecretById,
    getSecretById
  };
};
