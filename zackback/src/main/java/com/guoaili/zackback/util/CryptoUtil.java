package com.guoaili.zackback.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Component
public class CryptoUtil {
    private static final Logger logger = LoggerFactory.getLogger(CryptoUtil.class);

    @Value("${app.encryption.key}")
    private String secretKey;

    /**
     * 解密前端使用CryptoJS.AES.encrypt简单加密的数据
     */
    public String decrypt(String ivBase64,String minhuizpd) throws Exception {
        try {
            logger.debug("Decrypting with IV: {} and data: {}", ivBase64, minhuizpd);            
            // 解码 Base64 的 IV
            byte[] ivBytes = Base64.getDecoder().decode(ivBase64);
            
            // 解码 Base64 的密文
            byte[] encryptedBytes = Base64.getDecoder().decode(minhuizpd);
            
            // 准备密钥
            byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
// byte[] secretKeyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
// System.arraycopy(secretKeyBytes, 0, keyBytes, 0, Math.min(secretKeyBytes.length, keyBytes.length));
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
            
            // 初始化解密器
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            
            // 解密
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            String decrypted = new String(decryptedBytes, StandardCharsets.UTF_8);
            
            logger.debug("Successfully decrypted: {}", decrypted);
            return decrypted;
        } catch (Exception e) {
            logger.error("Decryption error", e);
            throw e;
        }
    }
    /**
     * 加密数据用于返回给前端
     * 
     * @param data 要加密的数据
     * @return 加密后的字符串
     */
    public String encrypt(String data) throws Exception {
        // 确保密钥长度为16字节(128位)
        byte[] keyBytes = new byte[16];
        byte[] secretKeyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        System.arraycopy(secretKeyBytes, 0, keyBytes, 0, 
                Math.min(secretKeyBytes.length, keyBytes.length));
        
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        
        // 生成随机IV
        byte[] ivBytes = new byte[16];
        // 在实际应用中应该使用安全随机数生成器
        for (int i = 0; i < 16; i++) {
            ivBytes[i] = (byte) (Math.random() * 256);
        }
        IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
        
        // 初始化加密器
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        
        // 加密
        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        String minhuizpd = Base64.getEncoder().encodeToString(encryptedBytes);
        String iv = Base64.getEncoder().encodeToString(ivBytes);
        
        // 返回格式: IV:加密数据
        return iv + ":" + minhuizpd;
    }
}