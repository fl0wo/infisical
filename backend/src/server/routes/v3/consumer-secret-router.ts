import { z } from "zod";

import { ConsumerSecretType } from "@app/db/schemas";
import { consumerSecretsLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

const zodDynamicConsumerSecretValueType = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ConsumerSecretType.WebsiteLogin),
    url: z.string().optional().describe("The URL of the website"),
    username: z.string().min(1).describe("The username of the website"),
    password: z.string().min(1).describe("The password of the website")
  }),

  z.object({
    type: z.literal(ConsumerSecretType.CreditCard),
    cardNumber: z.string().min(1).describe("The card number"),
    cardHolderName: z.string().min(1).describe("The card holder name"),
    expirationDate: z.string().min(1).describe("The card expiration date"),
    cvv: z.string().min(1).describe("The card CVV")
  }),

  z.object({
    type: z.literal(ConsumerSecretType.SecureNote),
    note: z.string().min(1).describe("The note")
  })
]);

const createConsumerSecretRequest = z.object({
  name: z.string().trim().describe("The name of the secret"),
  secretComment: z.string().trim().optional().default("").describe("The secret comment"),
  type: z.nativeEnum(ConsumerSecretType).describe("Either website_login, credit_card or secure_note"),

  secretValue: zodDynamicConsumerSecretValueType
});

const zodConsumerSecret = z.object({
  id: z.string().uuid(),
  name: z.string(),

  secretValue: zodDynamicConsumerSecretValueType,
  secretComment: z.string(), // It gets decrypted from service layer

  type: z.string(),
  userId: z.string().uuid().nullable().optional(),
  organizationId: z.string().uuid().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const registerConsumerSecretRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/list/:organizationId",
    config: {
      rateLimit: consumerSecretsLimit
    },
    schema: {
      description: "List consumer secrets of an organization, to move faster, those secrets will already be decrypted.",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        organizationId: z.string().trim().describe("Organization ID")
      }),
      response: {
        200: z.object({
          consumerSecrets: zodConsumerSecret.array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const paramOrgId = req.params.organizationId;

      // if this does not throw, then the user has access to the organization
      await server.services.permission.getOrgPermission(
        req.permission.type,
        req.permission.id,
        req.permission.orgId,
        req.permission.authMethod,
        paramOrgId
      );

      // TODO: enable check on the permission level
      // ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Read, OrgPermissionSubjects.ConsumerSecrets);

      const consumerSecretsOfOrganization =
        await server.services.consumerSecret.listAndDecryptSecretsByOrganizationId(paramOrgId);

      return {
        consumerSecrets: consumerSecretsOfOrganization
      };
    }
  });

  server.route({
    method: "GET",
    url: "/get/:consumerSecretId",
    config: {
      rateLimit: consumerSecretsLimit
    },
    schema: {
      description: "Get a consumer secret by it's id",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        consumerSecretId: z.string().trim().describe("Consumer Secret ID")
      }),
      response: {
        200: z.object({
          consumerSecret: zodConsumerSecret.optional()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // 1. get the consumer secret
      const paramConsumerSecretId = req.params.consumerSecretId;
      const consumerSecret = await server.services.consumerSecret.getAndDecryptSecretById(paramConsumerSecretId);

      const orgId = consumerSecret.organizationId;
      // 2. check if user belongs to the organization in which the secret is
      // if this does not throw, then the user has access to the organization
      await server.services.permission.getOrgPermission(
        req.permission.type,
        req.permission.id,
        req.permission.orgId,
        req.permission.authMethod,
        orgId
      );

      // TODO: enable check on the permission level
      // ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Read, OrgPermissionSubjects.ConsumerSecrets);

      return {
        consumerSecret
      };
    }
  });

  server.route({
    method: "POST",
    url: "/:organizationId",
    config: {
      rateLimit: consumerSecretsLimit
    },
    schema: {
      description: "Create consumer secret under a organization of a userId",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        organizationId: z.string().trim().describe("Organization ID")
      }),
      body: createConsumerSecretRequest,
      response: {
        // todo: add a type here plz
        200: z.any()
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const paramOrgId = req.params.organizationId;

      // if this does not throw, then the user has access to the organization
      await server.services.permission.getOrgPermission(
        req.permission.type,
        req.permission.id,
        req.permission.orgId,
        req.permission.authMethod,
        paramOrgId
      );
      // ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Insert, OrgPermissionSubjects.ConsumerSecrets);

      const secretName = req.body.name;

      const savedSecret = await server.services.consumerSecret.createSecret({
        organizationId: paramOrgId,
        name: secretName,
        type: req.body.type,
        userId: "6e74f399-b138-4f4e-94ab-bd0827b1e4fe",
        secretValue: req.body.secretValue,
        secretComment: req.body.secretComment
      });

      return {
        secret: savedSecret
      };
    }
  });

  server.route({
    method: "PATCH",
    url: "/:id",
    config: {
      rateLimit: consumerSecretsLimit
    },
    schema: {
      description: "Edit an existing consumer secret give its id",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe("Consumer Secret ID")
      }),
      body: createConsumerSecretRequest.partial().omit({
        type: true
      }),
      response: {
        200: z.boolean()
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // 1. get the consumer secret
      const paramConsumerSecretId = req.params.id;
      const consumerSecret = await server.services.consumerSecret.getAndDecryptSecretById(paramConsumerSecretId);

      // 2. check if user belongs to the organization in which the secret is
      const orgId = consumerSecret.organizationId;

      // if this does not throw, then the user has access to the organization
      await server.services.permission.getOrgPermission(
        req.permission.type,
        req.permission.id,
        req.permission.orgId,
        req.permission.authMethod,
        orgId
      );

      // TODO: enable check on the permission level
      // ForbiddenError.from(permission).throwUnlessCan(OrgPermissionActions.Edit, OrgPermissionSubjects.ConsumerSecrets);

      const updatedSecret = await server.services.consumerSecret.updateSecret(paramConsumerSecretId, {
        name: req.body.name,
        secretValue: req.body.secretValue,
        secretComment: req.body.secretComment
      });

      return !!updatedSecret;
    }
  });

  server.route({
    method: "DELETE",
    url: "/:id",
    config: {
      rateLimit: consumerSecretsLimit
    },
    schema: {
      description: "Delete a consumer secret by its id from the organization",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe("The ID of the secret to delete")
      }),
      body: z.null(),
      response: {
        200: z.number().describe("The number of deleted secrets should always be 1 or 0")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const paramConsumerSecretId = req.params.id;
      const consumerSecret = await server.services.consumerSecret.getSecretById(paramConsumerSecretId);

      const orgId = consumerSecret.organizationId;

      if (!orgId) {
        throw new Error("Organization ID not found");
      }

      // if this does not throw, then the user has access to the organization
      await server.services.permission.getOrgPermission(
        req.permission.type,
        req.permission.id,
        req.permission.orgId,
        req.permission.authMethod,
        orgId
      );

      return server.services.consumerSecret.deleteSecretById(consumerSecret.id);
    }
  });
};
