import CryptoJS from 'crypto-js';

// 加密函数
export const encrypt = (data, secretKey) => {
  const jsonStr = JSON.stringify(data);
  
  // 使用固定的密钥和 IV (仅用于测试)
  const key = CryptoJS.enc.Utf8.parse(secretKey); // 24字符密钥
  // const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16字节 IV
  // 随机生成16字节 IV
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // 使用明确的参数
  const encrypted = CryptoJS.AES.encrypt(jsonStr, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // 分别返回 IV 和密文
  return {
    iv: iv.toString(CryptoJS.enc.Base64),
    content: encrypted.toString()
  };
};
function formatKey(secretKey) {
  let key = secretKey;
  if (key.length < 16) key = key.padEnd(16, '0');
  else if (key.length > 16) key = key.slice(0, 16);
  return CryptoJS.enc.Utf8.parse(key);
}
// 解密函数
export const decrypt = (encryptedStr, secretKey) => {
  try {
    // 处理密钥
    const key = formatKey(secretKey);
    // 分离IV和密文
    const [iv, minhuizpd] = encryptedStr.split(':');
    
    // // 创建CipherParams对象
    // const cipherParams = CryptoJS.lib.CipherParams.create({
    //   ciphertext: CryptoJS.enc.Base64.parse(minhuizpd),
    //   iv: CryptoJS.enc.Base64.parse(iv),
    //   salt: undefined
    // });
    
    // // 解密
    // const decrypted = CryptoJS.AES.decrypt(
    //   cipherParams,
    //   secretKey,
    //   { iv: CryptoJS.enc.Base64.parse(iv) }
    // );
    
    // // 转换为字符串并解析JSON
    // return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    // 解密
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(minhuizpd) },
      key,
      {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    // 转换为字符串并解析JSON
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) throw new Error('Decryption failed, possibly wrong key or IV');
    return JSON.parse(decryptedStr);

  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};