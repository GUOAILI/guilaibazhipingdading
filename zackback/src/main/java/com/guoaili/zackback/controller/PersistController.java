package com.guoaili.zackback.controller;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.persistence.Entity;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Set;
import org.reflections.Reflections;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Qualifier;

@RestController
@CrossOrigin
@RequestMapping("/persist")
public class PersistController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Component
    public class SpringContextUtil implements ApplicationContextAware {
        private static ApplicationContext context;
        @Override
        public void setApplicationContext(ApplicationContext applicationContext) {
            context = applicationContext;
        }
        public static ApplicationContext getContext() {
            return context;
        }
    }
    @GetMapping("/serializeAll")
    public ResponseEntity<String> serializeAllEntities() throws IOException {
        // 1. 扫描entity包下所有实体类
        Reflections reflections = new Reflections("com.guoaili.zackback.entity");
        Set<Class<?>> entityClasses = reflections.getTypesAnnotatedWith(Entity.class)
            .stream()
            .filter(c -> !c.getSimpleName().equals("DpjEntity"))
            .collect(Collectors.toSet());
    
        Map<String, List<?>> allData = new HashMap<>();
        ApplicationContext ctx = SpringContextUtil.getContext();
    
        for (Class<?> entityClass : entityClasses) {
            // 2. 获取Repository的bean名
            String simpleName = entityClass.getSimpleName();
            String repoBeanName;
            if (simpleName.endsWith("Entity")) {
                String base = simpleName.substring(0, simpleName.length() - "Entity".length());
                repoBeanName = Character.toLowerCase(base.charAt(0)) + base.substring(1) + "Repository";
            } else {
                repoBeanName = Character.toLowerCase(simpleName.charAt(0)) + simpleName.substring(1) + "Repository";
            }            if (!ctx.containsBean(repoBeanName)) continue;
            Object repo = ctx.getBean(repoBeanName);
            try {
                // 3. 通过反射调用findAll
                List<?> data = (List<?>) repo.getClass().getMethod("findAll").invoke(repo);
                allData.put(entityClass.getSimpleName(), data);
                // 打印表名和记录数
                System.out.println("Table: " + entityClass.getSimpleName() + ", Records: " + data.size());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        // 备份users_roles交叉表
        List<Map<String, Object>> usersRoles = jdbcTemplate.queryForList("SELECT * FROM users_roles");
        allData.put("users_roles", usersRoles);
        // 4. 序列化Map到文件
        String filePath = "persist/all-entities-" + System.currentTimeMillis() + ".ser";
        Files.createDirectories(Paths.get("persist"));
        String absPath = Paths.get(filePath).toAbsolutePath().toString();
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(filePath))) {
            out.writeObject(allData);
        }
        return ResponseEntity.ok(absPath);
        // return ResponseEntity.ok("所有表数据已持久化到: " + filePath);
    }    
    
    @GetMapping("/deserializeAll/{filename}")
    @Transactional
    public ResponseEntity<String> deserializeAllEntities(@PathVariable String filename) throws IOException {
        String filePath = "persist/" + filename;
        if (!Files.exists(Paths.get(filePath))) throw new RuntimeException("文件不存在");
        Map<String, List<?>> allData;
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(filePath))) {
            allData = (Map<String, List<?>>) in.readObject();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("反序列化失败", e);
        }
        ApplicationContext ctx = SpringContextUtil.getContext();
        for (Map.Entry<String, List<?>> entry : allData.entrySet()) {
            String entityName = entry.getKey();
            List<?> dataList = entry.getValue();

            if ("users_roles".equals(entityName)) {
                // 还原交叉表
                for (Object row : dataList) {
                    Map<String, Object> map = (Map<String, Object>) row;
                    Long userId = ((Number) map.get("USER_ID")).longValue();
                    Long roleId = ((Number) map.get("ROLE_ID")).longValue();
                    jdbcTemplate.update("INSERT INTO users_roles (USER_ID, ROLE_ID) VALUES (?, ?)", userId, roleId);
                }
                continue;
            }
            String repoBeanName = Character.toLowerCase(entityName.charAt(0))
                + entityName.replace("Entity", "") + "Repository";
            if (!ctx.containsBean(repoBeanName)) continue;
            Object repo = ctx.getBean(repoBeanName);
            try {
                for (Object entity : dataList) {
                    // 可根据需要重置ID等
                    repo.getClass().getMethod("save", Object.class).invoke(repo, entity);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ResponseEntity.ok("所有表数据已恢复");
    }
}
