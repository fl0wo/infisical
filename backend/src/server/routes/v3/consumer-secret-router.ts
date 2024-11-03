import { z } from "zod";

import { ConsumerSecretType } from "@app/db/schemas";
import { secretsLimit } from "@app/server/config/rateLimiter";
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

export const registerConsumerSecretRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/:organizationId",
    config: {
      // todo: add a custom rate limit for this endpoint
      rateLimit: secretsLimit
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
          consumerSecrets: z
            .object({
              id: z.string().uuid(),
              name: z.string(),

              secretValue: zodDynamicConsumerSecretValueType,
              secretComment: z.string(), // It gets decrypted from service layer

              type: z.string(),
              userId: z.string().uuid().nullable().optional(),
              organizationId: z.string().uuid().nullable().optional(),
              createdAt: z.date().optional(),
              updatedAt: z.date().optional()
            })
            .array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // TODO: 1. understand how to get the current userId (logged session)
      // const userId = req.permission.id; // is this the user id?

      // TODO: 2. understand how to get the organizationId
      // const paramOrganizationId = req.params.organizationId; // maybe it's better to use this?

      // TODO: 3. understand how to check if the user belongs to the organization
      const { orgId } = req.permission;

      console.log("How we list secrets in-call?", req.permission);

      const consumerSecretsOfOrganization =
        await server.services.consumerSecret.listAndDecryptSecretsByOrganizationId(orgId);

      return {
        consumerSecrets: consumerSecretsOfOrganization
      };
    }
  });

  server.route({
    method: "POST",
    url: "/:organizationId",
    config: {
      // todo: add a custom rate limit for this endpoint
      rateLimit: secretsLimit
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
      // TODO: 1. understand how to get the current userId (logged session)
      // TODO: 2. understand how to get the organizationId
      // TODO: 3. understand how to check if the user belongs to the organization

      console.log("Creating Consumer Secret request", req.url, req.body);

      const myOrgId = req.params.organizationId;
      const secretName = req.body.name;

      // I can use .services.consumerSecret here cuz I injected it in the server (index.ts of routes)
      const savedSecret = await server.services.consumerSecret.createSecret({
        organizationId: myOrgId,
        name: secretName,
        type: req.body.type,
        userId: "6e74f399-b138-4f4e-94ab-bd0827b1e4fe",
        secretValue: req.body.secretValue,
        secretComment: req.body.secretComment
      });

      console.log("Saved secret", savedSecret);

      return {
        secret: savedSecret
      };
    }
  });

  // TODO: add PATCH

  // TODO: add DELETE
  server.route({
    method: "DELETE",
    url: "/:id",
    config: {
      rateLimit: secretsLimit
    },
    schema: {
      description: "Delete a consumer secret by it's id from the organization",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        id: z.string().trim().describe("The consumer secret ID")
      }),
      body: createConsumerSecretRequest,
      response: {
        200: z.number().describe("The number of deleted secrets")
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      console.log("Creating Consumer Secret request", req.url, req.body);

      const consumerSecretId = req.params.id;

      const existingSecret = await server.services.consumerSecret.getSecretById(consumerSecretId);

      if (!existingSecret) {
        throw new Error("Secret not found");
      }

      // TODO: 1. understand how to get the current userId (logged session)
      // is this existingSecret.userId == me

      // TODO: 2. understand how to get the organizationId
      // TODO: 4. understand if the secret belongs to the organization
      // is this existingSecret.organizationId == orgId

      // TODO: 3. understand how to check if the user belongs to the organization
      // is this existingSecret.organizationId == me.myOrg

      const savedSecret = await server.services.consumerSecret.deleteSecretById(existingSecret.id);

      console.log("Saved secret", savedSecret);

      return 0;
    }
  });
};
