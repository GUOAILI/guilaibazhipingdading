package com.guoaili.zackback.controller;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guoaili.zackback.exception.BusinessException;
import com.guoaili.zackback.model.ProgressTracker;
import com.guoaili.zackback.util.SpringContextUtil;

import jakarta.persistence.Entity;
import org.springframework.context.ApplicationContext;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.UUID;

import org.reflections.Reflections;

@RestController
@CrossOrigin
@RequestMapping("/persist")
public class PersistController {

    @GetMapping("/progress/{taskId}")
    public ResponseEntity<Integer> getProgress(@PathVariable String taskId) {
        int progress = SpringContextUtil.getProgressTracker().getProgress(taskId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/serializeAll")
    public ResponseEntity<String> startSerializeTask() {
        String taskId = UUID.randomUUID().toString();
        // 异步执行任务
        new Thread(() -> {
            try {
                serializeAllEntities(taskId); // 实际执行备份逻辑，传入taskId
            } catch (Exception e) {
                SpringContextUtil.getProgressTracker().setProgress(taskId, -1);
            }
        }).start();

        return ResponseEntity.ok(taskId); // 立即返回taskId
    }
    // @GetMapping("/serializeAll")
    public void serializeAllEntities(String taskId) throws IOException, BusinessException {
        // String taskId = UUID.randomUUID().toString();
        ProgressTracker tracker = SpringContextUtil.getProgressTracker();
        tracker.setProgress(taskId, 0); // 初始化任务

        try {
            // 1. 扫描entity包下所有实体类（5%）
            Reflections reflections = new Reflections("com.guoaili.zackback.entity");
            Set<Class<?>> entityClasses = reflections.getTypesAnnotatedWith(Entity.class)
                .stream()
                .filter(c -> 
                    !c.getSimpleName().equals("DpjEntity") &&
                    !c.getSimpleName().equals("Role") &&
                    !c.getSimpleName().equals("User")
                )
                .collect(Collectors.toSet());
            tracker.setProgress(taskId, 5);

            // 2. 获取Repository的bean名 + 调用findAll（共10% → 每个类平均分配）
            Map<String, List<?>> allData = new HashMap<>();
            ApplicationContext ctx = SpringContextUtil.getContext();
            int entityCount = entityClasses.size();
            int processed = 0;

            for (Class<?> entityClass : entityClasses) {
                String simpleName = entityClass.getSimpleName();
                String repoBeanName;
                if (simpleName.endsWith("Entity")) {
                    String base = simpleName.substring(0, simpleName.length() - "Entity".length());
                    repoBeanName = Character.toLowerCase(base.charAt(0)) + base.substring(1) + "Repository";
                } else {
                    repoBeanName = Character.toLowerCase(simpleName.charAt(0)) + simpleName.substring(1) + "Repository";
                }

                if (!ctx.containsBean(repoBeanName)) {
                    tracker.setProgress(taskId, 10 * (++processed) / entityCount + 5);
                    continue;
                }

                Object repo = ctx.getBean(repoBeanName);
                try {
                    // 3. 通过反射调用findAll（每个类占15%总进度中的一部分）
                    List<?> data = (List<?>) repo.getClass().getMethod("findAll").invoke(repo);
                    allData.put(entityClass.getSimpleName(), data);
                    // System.out.println("Table: " + entityClass.getSimpleName() + ", Records: " + data.size());
                } catch (Exception e) {
                    throw new BusinessException("序列化失败，调用反射方法出错");
                }
                tracker.setProgress(taskId, 15 * (++processed) / entityCount + 5);
            }

            // 4. 序列化Map到文件（25%）
            String filePath = "persist/all-entities-" + System.currentTimeMillis() + ".ser";
            Files.createDirectories(Paths.get("persist"));
            // String absPath = Paths.get(filePath).toAbsolutePath().toString();

            try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(filePath))) {
                out.writeObject(allData);
            }
            tracker.setProgress(taskId, 25);

            // 4.1 删除旧的ser文件（30%）
            List<java.nio.file.Path> serFiles = Files.list(Paths.get("persist"))
                .filter(p -> p.getFileName().toString().startsWith("all-entities-") && p.getFileName().toString().endsWith(".ser"))
                .sorted((a, b) -> {
                    long ta = Long.parseLong(a.getFileName().toString().replaceAll("\\D+", ""));
                    long tb = Long.parseLong(b.getFileName().toString().replaceAll("\\D+", ""));
                    return Long.compare(tb, ta); // 新的在前
                })
                .collect(Collectors.toList());
            if (serFiles.size() > 3) {
                for (int i = 3; i < serFiles.size(); i++) {
                    try {
                        Files.deleteIfExists(serFiles.get(i));
                    } catch (IOException e) {
                        throw new BusinessException("删除旧的序列化文件失败");
                    }
                }
            }
            tracker.setProgress(taskId, 30);

            // 5. 压缩uploads文件夹到persist目录（95%）
            String uploadsDir = "uploads";
            String zipFileName = "uploads-" + System.currentTimeMillis() + ".zip";
            String zipFilePath = "persist/" + zipFileName;
            // String absPath1 = Paths.get(zipFilePath).toAbsolutePath().toString();

            if (Files.exists(Paths.get(uploadsDir))) {
                // 统计文件总数
                List<java.nio.file.Path> fileList = Files.walk(Paths.get(uploadsDir))
                    .filter(Files::isRegularFile)
                    .collect(java.util.stream.Collectors.toList());
                int totalFiles = fileList.size();
                int updateSteps = 20;
                int filesPerStep = Math.max(1, totalFiles / updateSteps);
                int filesProcessed = 0;
                int lastStep = 0;

                try (FileOutputStream fos = new FileOutputStream(zipFilePath);
                    java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(fos)) {
                    for (java.nio.file.Path path : fileList) {
                        java.util.zip.ZipEntry zipEntry = new java.util.zip.ZipEntry(Paths.get(uploadsDir).relativize(path).toString());
                        zos.putNextEntry(zipEntry);
                        Files.copy(path, zos);
                        zos.closeEntry();

                        filesProcessed++;
                        int step = filesProcessed / filesPerStep;
                        // 进度从40%到90%
                        int percent = 40 + (int)((step / (double)updateSteps) * 50);
                        if (step > lastStep && percent <= 90) {
                            tracker.setProgress(taskId, percent);
                            lastStep = step;
                        }
                    }
                    // 压缩完成，进度设为90%
                    tracker.setProgress(taskId, 90);
                } catch (IOException e) {
                    tracker.setProgress(taskId, -1);
                    throw new BusinessException("压缩上传文件失败");
                }
            } else {
                // 没有uploads目录也要推进进度
                tracker.setProgress(taskId, 90);
            }

            // 6. 删除旧的zip文件（100%）
            List<java.nio.file.Path> zipFiles = Files.list(Paths.get("persist"))
                .filter(p -> p.getFileName().toString().startsWith("uploads-") && p.getFileName().toString().endsWith(".zip"))
                .sorted((a, b) -> {
                    long ta = Long.parseLong(a.getFileName().toString().replaceAll("\\D+", ""));
                    long tb = Long.parseLong(b.getFileName().toString().replaceAll("\\D+", ""));
                    return Long.compare(tb, ta); // 新的在前
                })
                .collect(Collectors.toList());
            if (zipFiles.size() > 2) {
                for (int i = 2; i < zipFiles.size(); i++) {
                    try {
                        Files.deleteIfExists(zipFiles.get(i));
                    } catch (IOException e) {
                        throw new BusinessException("删除旧的压缩文件失败");
                    }
                }
            }

            tracker.setProgress(taskId, 100); // 完成

            // return ResponseEntity.ok(absPath + "; 图片文件已保存在:C:/minhui" + absPath1 + "?taskId=" + taskId);
        } catch (Exception e) {
            tracker.setProgress(taskId, -1); // 失败标记
            throw new BusinessException("备份失败: " + e.getMessage());
        }
    }

    @GetMapping("/deserializeAll/{filename}")
    @Transactional
    public ResponseEntity<String> deserializeAllEntities(@PathVariable String filename) throws IOException, BusinessException {
        String filePath = "persist/" + filename;
        // if (!Files.exists(Paths.get(filePath))) throw new RuntimeException("文件不存在");
        if (!Files.exists(Paths.get(filePath))) throw new BusinessException("文件不存在");
        Map<String, List<?>> allData;
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(filePath))) {
            allData = (Map<String, List<?>>) in.readObject();
        } catch (ClassNotFoundException e) {
            // throw new RuntimeException("反序列化失败", e);
            throw new BusinessException("恢复表数据失败，未找到对象类");
        }
        ApplicationContext ctx = SpringContextUtil.getContext();
        for (Map.Entry<String, List<?>> entry : allData.entrySet()) {
            String entityName = entry.getKey();
            List<?> dataList = entry.getValue();
            String beanBase = entityName.replace("Entity", "");
            String repoBeanName = Character.toLowerCase(beanBase.charAt(0)) + beanBase.substring(1) + "Repository";
            if (!ctx.containsBean(repoBeanName)) continue;
            Object repo = ctx.getBean(repoBeanName);
            try {
                for (Object entity : dataList) {
                    // 针对 User 实体做唯一性校验
                    if ("User".equals(entityName) || "Role".equals(entityName)) {
                        continue;
                    }                        
                    repo.getClass().getMethod("save", Object.class).invoke(repo, entity);
                }
            } catch (Exception e) {
                throw new BusinessException("恢复表数据失败，调用反射方法出错");
            }
        }

        return ResponseEntity.ok("所有表数据已恢复");
    }

    @GetMapping("/unzipAll/{filename}")
    public ResponseEntity<String> startUnzipTask(@PathVariable String filename) throws IOException {
        String taskId = UUID.randomUUID().toString();

        new Thread(() -> {
            try {
                unzipAllPictures(filename, taskId);
            } catch (Exception e) {
                SpringContextUtil.getProgressTracker().setProgress(taskId, -1);
            }
        }).start();

        return ResponseEntity.ok(taskId);
    }
    private void unzipAllPictures(String filename, String taskId) throws IOException, BusinessException {
        ProgressTracker tracker = SpringContextUtil.getProgressTracker();
        tracker.setProgress(taskId, 0);

        String filePath = "persist/" + filename;
        if (!Files.exists(Paths.get(filePath))) {
            throw new BusinessException("文件不存在");
        }

        Files.createDirectories(Paths.get("uploads"));

        int totalSteps = 20;

        try (java.util.zip.ZipFile zipFile = new java.util.zip.ZipFile(filePath)) {
            List<? extends java.util.zip.ZipEntry> entries = java.util.Collections.list(zipFile.entries());
            int totalFiles = entries.size();
            int updateSteps = Math.max(1, totalFiles / totalSteps);
            if (totalFiles != 0) tracker.setProgress(taskId, 5);

            int filesExtracted = 0;
            for (java.util.zip.ZipEntry entry : entries) {
                if (entry.isDirectory()) continue;
                String entryName = entry.getName();
                java.nio.file.Path targetPath = Paths.get("uploads", entryName);
                Files.createDirectories(targetPath.getParent());

                try (java.io.InputStream is = zipFile.getInputStream(entry)) {
                    Files.copy(is, targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                }

                filesExtracted++;
                if (filesExtracted % updateSteps == 0 || filesExtracted == totalFiles) {
                    int percent = 5 + (int)((double) filesExtracted / totalFiles * 95);
                    tracker.setProgress(taskId, percent);
                }
            }
            tracker.setProgress(taskId, 100);
        } catch (Exception e) {
            tracker.setProgress(taskId, -1);
            throw new BusinessException("图片备份文件解压失败: " + e.getMessage());
        }
    }
}
