package com.guoaili.zackback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryVo extends DpjVo {
    private String title;
    private String easy;
    private String knowledge;
    private String keyPoints;
    private String example;
    
    public SummaryVo(String title, String easy, String knowledge, String keyPoints, String example, String subject, List<MultipartFile> files) {
        super();
        this.title = title;
        this.easy = easy;
        this.knowledge = knowledge;
        this.keyPoints = keyPoints;
        this.example = example;
        this.setSubject(subject);
        this.setFiles(files);
    }
}