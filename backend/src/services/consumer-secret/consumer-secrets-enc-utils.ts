// TODO: we should Instead use a service dedicated to encryption and decryption and blob handling
// Convert base64 to buffer and back
import { ConsumerSecretType } from "@app/db/schemas";
import { TConsumerSecrets } from "@app/db/schemas/consumer-secrets";
import { decryptSymmetric128BitHexKeyUTF8, encryptSymmetric128BitHexKeyUTF8 } from "@app/lib/crypto";
import {
  TCreateConsumerSecretDTO,
  TCreateConsumerSecretDTOInsert
} from "@app/services/consumer-secret/consumer-secret-types";

const tempKey = "01234567890123456789012345678901";

export function base64ToBuffer(base64: string) {
  return Buffer.from(base64, "base64");
}

export function bufferToBase64(buffer: Buffer) {
  return buffer.toString("base64");
}

// Combine the fields into a single buffer
export function combineFields(obj: { ciphertext: string; iv: string; tag: string }) {
  const ciphertextBuffer = base64ToBuffer(obj.ciphertext);
  const ivBuffer = base64ToBuffer(obj.iv);
  const tagBuffer = base64ToBuffer(obj.tag);

  // Create a buffer to store the lengths (4 bytes each)
  const lengthsBuffer = Buffer.alloc(12);
  lengthsBuffer.writeUInt32BE(ciphertextBuffer.length, 0);
  lengthsBuffer.writeUInt32BE(ivBuffer.length, 4);
  lengthsBuffer.writeUInt32BE(tagBuffer.length, 8);

  // Concatenate all buffers
  return Buffer.concat([lengthsBuffer, ciphertextBuffer, ivBuffer, tagBuffer]);
}

// Split the combined buffer back into the original fields
export function splitFields(combinedBuffer: Buffer) {
  // Read the lengths
  const ciphertextLength = combinedBuffer.readUInt32BE(0);
  const ivLength = combinedBuffer.readUInt32BE(4);
  const tagLength = combinedBuffer.readUInt32BE(8);

  // Calculate positions
  let pos = 12; // Start after the lengths section

  // Extract each field
  const ciphertext = combinedBuffer.slice(pos, pos + ciphertextLength);
  pos += ciphertextLength;

  const iv = combinedBuffer.slice(pos, pos + ivLength);
  pos += ivLength;

  const tag = combinedBuffer.slice(pos, pos + tagLength);

  // Return object with base64 strings
  return {
    ciphertext: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv),
    tag: bufferToBase64(tag)
  };
}

export const decryptConsumerSecretToModelDTO = (encryptedSecret: TConsumerSecrets) => {
  const secretValueText = decryptSymmetric128BitHexKeyUTF8({
    ...splitFields(encryptedSecret.encryptedValue),
    key: tempKey
  });
  const secretCommentText = decryptSymmetric128BitHexKeyUTF8({
    ...splitFields(encryptedSecret.encryptedComment),
    key: tempKey
  });

  if (!secretValueText || !secretCommentText || !encryptedSecret.userId || !encryptedSecret.organizationId) {
    throw new Error("Failed to decrypt secret");
  }

  const x: TCreateConsumerSecretDTO = {
    id: encryptedSecret.id,
    userId: encryptedSecret.userId,
    organizationId: encryptedSecret.organizationId,

    name: encryptedSecret.name,
    type: encryptedSecret.type as ConsumerSecretType,

    createdAt: encryptedSecret.createdAt,
    updatedAt: encryptedSecret.updatedAt,

    // fixme: JSON.parse a bit risky here don't you think?
    secretValue: JSON.parse(secretValueText) as TCreateConsumerSecretDTO["secretValue"],
    secretComment: secretCommentText
  };

  return x;
};

export const encryptConsumerSecretModelDTO = (body: TCreateConsumerSecretDTOInsert) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  // Is there a better way to do this?
  const stringifiedSecretValue = JSON.stringify(body.secretValue);

  // FIXME: What enc key can we use? Maybe something related and unique to the Org, but hidden from the outside world mmmm
  // Could I use infisicalSymmetricEncypt and use the ROOT key? Maybe not? mmmmmmmmm

  const secretValueEncrypted = encryptSymmetric128BitHexKeyUTF8(stringifiedSecretValue, tempKey);
  const secretCommentEncrypted = encryptSymmetric128BitHexKeyUTF8(body.secretComment, tempKey);
  // Should I merge chiperText, iv, tag, keyEncoding, algorithm, etc. into a single stringEncryptedValue and store it in the DB as a single column?
  // I noticed that there's a service called kmsServiceFactory that has a encryptor and decryptor that merges those 3 fields into a signle blob buffer and saves it in the db as a blob column not 3 strings
  // For this MVP I'll do code duplication:

  // concat the buffers in an order that can be split later
  // I'm going to save those fields in the DB as "encryptedValue" and "encryptedComment" as a single column
  const encryptedValueBuffer = combineFields(secretValueEncrypted);
  const encryptedCommentBuffer = combineFields(secretCommentEncrypted);

  return {
    ...body,
    secretValue: encryptedValueBuffer,
    secretComment: encryptedCommentBuffer
  };
};
