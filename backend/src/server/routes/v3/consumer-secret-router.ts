import { z } from "zod";

import { ConsumerSecretType } from "@app/db/schemas";
import { secretsLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

import { consumerSecretRawSchema } from "../sanitizedSchemas";

// TODO: this is the router that will handle the consumer secrets in the backend
const createConsumerSecretRequest = z.object({
  name: z.string().trim().describe("The name of the secret"),
  secretComment: z.string().trim().optional().default("").describe("the secret comment"),
  type: z.nativeEnum(ConsumerSecretType).describe("Either website_login, credit_card or secure_note"),

  secretValue: z.discriminatedUnion("type", [
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
  ])
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
      description: "List consumer secrets",
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
          consumerSecrets: consumerSecretRawSchema.array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // just for delivery hero usecase
      // const { organizationId } = req.query;

      // TODO: 1. understand how to get the current userId (logged session)
      // TODO: 2. understand how to get the organizationId
      // TODO: 3. understand how to check if the user belongs to the organization

      console.log("How we list secrets in-call?", {
        actorId: req.permission.id,
        actor: req.permission.type,
        actorOrgId: req.permission.orgId,
        query: req.query,
        actorAuthMethod: req.permission.authMethod
      });

      // fake result for now
      return {
        consumerSecrets: []
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
        200: z.object({
          secret: consumerSecretRawSchema.optional()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.API_KEY, AuthMode.SERVICE_TOKEN, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // TODO: 1. understand how to get the current userId (logged session)
      // TODO: 2. understand how to get the organizationId
      // TODO: 3. understand how to check if the user belongs to the organization

      // TODO: 4. understand how to safely encrypt the JSON object as a secret string
      // TODO: 5. call the service to save the secret in the DB under the consumerSecret table

      console.log("Creating Consumer Secret request", req.url, req.body);

      const savedSecret = await server.services.consumerSecret.createSecret({
        organizationId: req.params.organizationId,
        name: req.body.name,
        secretComment: req.body.secretComment,
        type: req.body.type,
        secretValue: req.body.secretValue
      });

      console.log("Saved secret", savedSecret);

      // step1. generate the table in the DB :-)
      // step2 run the gen schemas

      return {
        // secret: null
      };
    }
  });

  // TODO: add PATCH and DELETE (look how they do in secret-router.ts)
};
