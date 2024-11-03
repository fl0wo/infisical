// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { zodBuffer } from "@app/lib/zod";

import { TImmutableDBKeys } from "./models";

export const ConsumerSecretsSchema = z.object({
  id: z.string().uuid(),
  version: z.number().default(1),
  name: z.string(),
  encryptedValue: zodBuffer,
  encryptedComment: zodBuffer,
  test: z.string().nullable().optional(),
  type: z.string(),
  userId: z.string().uuid().nullable().optional(),
  organizationId: z.string().uuid().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TConsumerSecrets = z.infer<typeof ConsumerSecretsSchema>;
export type TConsumerSecretsInsert = Omit<z.input<typeof ConsumerSecretsSchema>, TImmutableDBKeys>;
export type TConsumerSecretsUpdate = Partial<Omit<z.input<typeof ConsumerSecretsSchema>, TImmutableDBKeys>>;
