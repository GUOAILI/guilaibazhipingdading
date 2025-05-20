package com.guoaili.zackback.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public class FileParamUtil {
    /**
     * 从参数Map中解析出文件列表
     * @param params 参数Map
     * @param key 文件字段名（如"files"）
     * @return MultipartFile列表
     */
    @SuppressWarnings("unchecked")
    public static List<MultipartFile> parseFilesFromParam(Map<String, Object> params, String key) {
        List<MultipartFile> multipartFiles = new ArrayList<>();
        Object filesObj = params.get(key);
        if (filesObj instanceof List<?>) {
            List<?> files = (List<?>) filesObj;
            for (Object fileObj : files) {
                if (fileObj instanceof Map) {
                    Map<String, Object> fileMap = (Map<String, Object>) fileObj;
                    String fileName = fileMap.get("fileName").toString();
                    String contentType = fileMap.get("contentType").toString();
                    String base64 = fileMap.get("base64").toString();
                    byte[] fileBytes = Base64.getDecoder().decode(base64);
                    // MockMultipartFile mf = new MockMultipartFile(fileName, fileName, contentType, fileBytes);
                    MultipartFile mf = new SimpleMultipartFile(fileName, fileName, contentType, fileBytes);
                    multipartFiles.add(mf);
                }
            }
        }
        return multipartFiles;
    }
}