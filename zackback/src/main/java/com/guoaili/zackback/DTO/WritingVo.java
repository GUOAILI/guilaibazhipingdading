package com.guoaili.zackback.DTO;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WritingVo extends DpjVo {
    private int imp;

    private String title;
    private String topic;
    private String sample;
    private String comments;
    // private String subject;
    // private List<MultipartFile> files;
    public WritingVo(int imp, String title, String topic, String sample, String comments, String subject, List<MultipartFile> files) {
        super();
        this.imp = imp;
        this.title = title;
        this.topic = topic;
        this.sample = sample;
        this.comments = comments;
        this.setSubject(subject);
        this.setFiles(files);
    }
}
