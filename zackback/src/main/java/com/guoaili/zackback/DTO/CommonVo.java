package com.guoaili.zackback.DTO;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonVo extends DpjVo {

    private String title;
    private String sample;
    // private String subject;

    // private MultipartFile[] file;
    // private List<MultipartFile> files;
    public CommonVo(String title, String sample, String subject, List<MultipartFile> files) {
        super();
        this.title = title;
        this.sample = sample;
        this.setSubject(subject);
        this.setFiles(files);
    }
}
