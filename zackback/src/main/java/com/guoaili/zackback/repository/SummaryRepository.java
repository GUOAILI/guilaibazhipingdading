package com.guoaili.zackback.repository;

import com.guoaili.zackback.entity.SummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SummaryRepository extends JpaRepository<SummaryEntity, Long> {
    
    @Query(value = "select * from summary where username=?1 and subject=?2 and is_deleted=false", nativeQuery = true)
    List<SummaryEntity> findBySubject(String username, String subject);
    @Transactional
    @Modifying
    @Query(value =  "update summary set is_deleted=true where id=?1",nativeQuery = true)
    void logicalDeleteById(long id);



}