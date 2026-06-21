import { uuidv7 } from "uuidv7";
import logger from "@/services/logger";

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Encodes a standard UUIDv7 string into a shareable ABC-XXXXX format
 */
export function encodeUuidToShareCode(uuid: string, prefix: string = 'ABC'): string {
  // Remove hyphens and convert hex string to a 128-bit BigInt
  const hex = uuid.replace(/-/g, '');
  let bigint = BigInt(`0x${hex}`);

  let encoded = '';
  while (bigint > 0n) {
    const remainder = Number(bigint % 62n);
    encoded = BASE62_ALPHABET[remainder] + encoded;
    bigint = bigint / 62n;
  }

  // Pad left to ensure consistent length if the UUID value is small
  return `${prefix}-${encoded.padStart(22, '0')}`;
}

/**
 * Decodes the shareable string back into a standard UUID format for database querying
 */
export function decodeShareCodeToUuid(shareCode: string, prefix: string): false | string {
  if (!shareCode.startsWith(`${prefix}-`)) {
    return false;
  }
  try {
    // Strip the prefix (e.g., "ABC-")
    const cleanCode = shareCode.split('-')[1] || shareCode;
  
    let bigint = 0n;
    for (let i = 0; i < cleanCode.length; i++) {
      const char = cleanCode[i];
      const value = BigInt(BASE62_ALPHABET.indexOf(char || ''));
      bigint = bigint * 62n + value;
    }
  
    // Convert BigInt back to a 32-character hex string
    const hex = bigint.toString(16).padStart(32, '0');
  
    // Re-insert standard UUID hyphens (8-4-4-4-12)
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } catch (error) {
    logger.error('shareCodeService.encodeUuidToShareCode: Error decoding shareCode');
    logger.debug(error);
    return false;
  }
}

export function addShareCodeToModel(model: { id?: string, shareCode: string }, prefix: string) {
  // 1. Force ID generation if not explicitly provided
  if (!model.id) {
    model.id = uuidv7();
  }
  // 2. Generate shareCode using the resolved ID
  model.shareCode = encodeUuidToShareCode(model.id as string, prefix);
}