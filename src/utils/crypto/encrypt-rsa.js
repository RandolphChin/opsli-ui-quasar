import { JSEncrypt } from "jsencrypt";

/**
 * 最长加密长度
 * @type {number}
 */
const MAX_ENCRYPT_BLOCK = 117;
/**
 * 最长解码长度
 * @type {number}
 */
const MAX_DECRYPT_BLOCK = 128;

/**
 * @description RSA加密(支持长字符加密)
 * @param data 加密数据
 * @param publicKey 公钥
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export const encryptedRsa = (data, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  );
  // Convert data to JSON string and then to an Uint8Array using TextEncoder
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const buffer = encoder.encode(jsonString); // Encodes to Uint8Array
  const inputLen = buffer.length;

  let offSet = 0;
  let result = "";

  while (inputLen - offSet > 0) {
    let bufTmp;

    // Slice the buffer for the encryption block
    if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
      bufTmp = buffer.slice(offSet, offSet + MAX_ENCRYPT_BLOCK);
    } else {
      bufTmp = buffer.slice(offSet, inputLen);
    }

    // Convert Uint8Array to a string to pass to encrypt function
    const hexTmp = encrypt.encrypt(bufTmp.reduce((data, byte) => data + String.fromCharCode(byte), ''));

    // Append the encrypted result
    if (hexTmp) {
      result += atob(hexTmp);
    }

    offSet += MAX_ENCRYPT_BLOCK;
  }

  return btoa(result); // Return the final Base64 encoded result
};
export const encryptedRsa22 = (data, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  );
  let bufTmp = "",
    hexTmp = "",
    result = "";
  let offSet = 0;
  const buffer = Buffer.from(JSON.stringify(data));
  const inputLen = buffer.length;
  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
      bufTmp = buffer.slice(offSet, offSet + MAX_ENCRYPT_BLOCK);
    } else {
      bufTmp = buffer.slice(offSet, inputLen);
    }
    hexTmp = encrypt.encrypt(bufTmp.toString());
    result += atob(hexTmp);
    offSet += MAX_ENCRYPT_BLOCK;
  }
  return btoa(result);
};
/**
 * @description RSA解密(支持长字符解密)
 * @param data 数据
 * @param privateKey 私钥
 * @returns {PromiseLike<ArrayBuffer>}
 */
export const decryptedRsa = (data, privateKey) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  );
  let bufTmp = "",
    hexTmp = "",
    result = "";
  let offSet = 0;
  const buffer = atob(data);
  const inputLen = buffer.length;
  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
      bufTmp = buffer.slice(offSet, offSet + MAX_DECRYPT_BLOCK);
    } else {
      bufTmp = buffer.slice(offSet, inputLen);
    }
    hexTmp = decrypt.decrypt(btoa(bufTmp));
    result += hexTmp;
    offSet += MAX_DECRYPT_BLOCK;
  }
  return JSON.parse(result);
};
