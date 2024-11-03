// TODO: we should Instead use a service dedicated to encryption and decryption and blob handling
// Convert base64 to buffer and back
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
