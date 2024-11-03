/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */

import { TConsumerSecretDALFactory } from "@app/services/consumer-secret/secret-dal";

import { TCreateConsumerSecretDTO } from "./secret-types";

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

    console.log("Noway i got invoked", body, !!consumerSecretDAL);
    // {
    // infisical-dev-api              |   organizationId: 'organizationId',
    // infisical-dev-api              |   name: 'my-consumer-secret',
    // infisical-dev-api              |   secretComment: 'This is a fixed note',
    // infisical-dev-api              |   type: 'website_login',
    // infisical-dev-api              |   secretValue: {
    // infisical-dev-api              |     type: 'website_login',
    // infisical-dev-api              |     url: 'https://ciao.it',
    // infisical-dev-api              |     username: 'body',
    // infisical-dev-api              |     password: 'body'
    // infisical-dev-api              |   }
    // infisical-dev-api              | }

    return {
      ciao: "test"
    };

    // return result.
  };

  return {
    createSecret
  };
};
