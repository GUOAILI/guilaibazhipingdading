package com.guoaili.zackback.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.guoaili.zackback.entity.CommonEntity;

public interface CommonRepository extends JpaRepository<CommonEntity, Long> {
    List<CommonEntity> findBySubjectAndDeletedFalse(String subject);
}