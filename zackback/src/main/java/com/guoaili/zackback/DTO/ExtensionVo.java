package com.guoaili.zackback.DTO;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtensionVo extends DpjVo {
    private LocalDate extDate;
    private String teacher;
    private String abs;
    private String easy;
    private String content;
    // private String subject;
    // private List<MultipartFile> files;
    public ExtensionVo(LocalDate extDate, String teacher, String abs, String easy, String content, String subject, List<MultipartFile> files) {
        super();
        this.extDate = extDate;
        this.teacher = teacher;
        this.abs = abs;
        this.easy = easy;
        this.content = content;
        this.setSubject(subject);
        this.setFiles(files);
    }       
}
