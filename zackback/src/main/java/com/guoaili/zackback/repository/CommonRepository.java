package com.guoaili.zackback.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.guoaili.zackback.entity.CommonEntity;

public interface CommonRepository extends JpaRepository<CommonEntity, Long> {
    // List<CommonEntity> findBySubjectAndUsernameAndDeletedFalse(String username,String subject);
    @Query(value =  "select * from common where username=?1 and subject=?2 and is_deleted=false",nativeQuery = true)
    List<CommonEntity> findBySubject(String username,String subject);

    // 教训2024/6/22更新操作时，一定要加事务
    @Transactional
    @Modifying
    @Query(value =  "update common set is_deleted=true where id=?1",nativeQuery = true)
    void logicalDeleteById(long id);

}